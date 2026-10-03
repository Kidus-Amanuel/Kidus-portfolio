import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeQuestion } from "@/lib/normalizeQuestion";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const recentBundles: string[] = [];
const MAX_RECENT = 8;

const FALLBACK_REASONS = [
  "I will be a better person because of this. Probably. Possibly. Ask me in a week.",
  "You were probably going to do something less interesting instead. Be honest.",
  "Think of this as an investment. The investment is me. The returns are currently unavailable. Trust the process.",
];

const COMEDY_SYSTEM_PROMPT = `You are the comedy writer for a ridiculous interactive website called Yes-Only.

The sender wants a friend to agree to a specific request. You will be given the request (the "reason"). Generate THREE short, funny reasons that make the friend want to say yes — each one tied to that specific reason.

Rules:
- Output EXACTLY 3 reasons as a JSON array of strings, nothing else.
- Each reason: 1 to 3 sentences. No more.
- Each reason must feel different — different angle, different joke structure.
- Self-aware, slightly absurd, clever, friendly. Internet-native humor.
- Tie each joke back to the reason the sender gave whenever it helps.
- DO NOT be offensive, political, insulting, or make serious claims.
- Avoid repeating previous reasons.
- Make them feel like something a clever friend would say, not a corporate joke.

Example output:
["reason one text", "reason two text", "reason three text"]`;

function pickFallbackBundle(): string[] {
  // Slightly randomize the fallback order so it doesn't feel canned
  const arr = [...FALLBACK_REASONS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function safeParseBundle(text: string): string[] | null {
  // Strip markdown fences if Gemini wraps the JSON
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    if (
      Array.isArray(parsed) &&
      parsed.length >= 3 &&
      parsed.every((r) => typeof r === "string") &&
      parsed.every((r) => r.length > 0 && r.length <= 500)
    ) {
      // Trim to first 3 just in case
      return parsed.slice(0, 3).map((s) => s.trim());
    }
  } catch {
    // Fall through to null
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawReason = String(body?.reason ?? "").trim();
    const extraContext = String(body?.context ?? "").trim().slice(0, 240);

    if (!rawReason) {
      return NextResponse.json(
        { error: "reason is required" },
        { status: 400 }
      );
    }

    const reason = rawReason.slice(0, 200);
    const normalized = normalizeQuestion(reason);

    // 1) Check the DB cache first
    try {
      const cached = await prisma.question.findUnique({
        where: { normalized },
        include: {
          answers: { orderBy: { createdAt: "desc" } },
        },
      });

      if (cached && cached.answers.length > 0) {
        // Newest answer first — it stores reasons as JSON
        for (const ans of cached.answers) {
          const parsed = safeParseBundle(ans.content);
          if (parsed) {
            // Fire-and-forget usage bump on the matching answer
            prisma.answer
              .update({
                where: { id: ans.id },
                data: { usageCount: { increment: 1 } },
              })
              .catch(() => {});

            return NextResponse.json({
              reasons: parsed,
              cached: true,
            });
          }
        }
      }
    } catch (dbErr) {
      console.error("[/api/generate-joke] cache lookup failed:", dbErr);
    }

    // 2) Cache miss → ask Gemini for a 3-reason bundle
    let bundle: string[] = [];
    try {
      const previousBlock =
        recentBundles.length > 0
          ? `\n\nRecent reason sets to avoid repeating:\n${recentBundles
              .slice(-3)
              .map((b, i) => `Set ${i + 1}:\n${b}`)
              .join("\n\n")}`
          : "";

      const contextBlock = extraContext
        ? `\n\nExtra context (use only if it helps): ${extraContext}`
        : "";

      const userPrompt = `The sender's request is: "${reason}"

Generate 3 short funny reasons the friend should say yes — each tied to this request, all different from each other.${previousBlock}${contextBlock}`;

      const result = await generateText({
        model: google("gemini-1.5-pro-latest"),
        system: COMEDY_SYSTEM_PROMPT,
        prompt: userPrompt,
        temperature: 1.2,
        maxTokens: 500,
      });

      const parsed = safeParseBundle(result.text);
      bundle = parsed || pickFallbackBundle();
    } catch (aiErr) {
      console.error("[/api/generate-joke] AI generation failed:", aiErr);
      bundle = pickFallbackBundle();
    }

    // 3) Persist the bundle as JSON in the Answer table
    try {
      const dbQuestion = await prisma.question.upsert({
        where: { normalized },
        update: {},
        create: { normalized, original: reason },
      });

      await prisma.answer.create({
        data: {
          questionId: dbQuestion.id,
          content: JSON.stringify(bundle),
        },
      });
    } catch (dbErr) {
      console.error("[/api/generate-joke] cache write failed:", dbErr);
    }

    recentBundles.push(bundle.join(" | "));
    if (recentBundles.length > MAX_RECENT) recentBundles.shift();

    return NextResponse.json({
      reasons: bundle,
      cached: false,
    });
  } catch (err) {
    console.error("[/api/generate-joke] fatal:", err);
    return NextResponse.json({
      reasons: pickFallbackBundle(),
      cached: false,
      fallback: true,
    });
  }
}