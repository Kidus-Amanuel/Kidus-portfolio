import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeQuestion } from "@/lib/normalizeQuestion";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

const recentBundles: string[] = [];
const MAX_RECENT = 8;

const FALLBACK_REASONS = [
  "Scientifically proven to boost your good karma and strengthen your Wi-Fi signal.",
  "If you say no, I will be forced to take up the bagpipes out of pure boredom.",
  "I will personally give you a standing ovation every time you walk into a room.",
];

const COMEDIC_ANGLES = [
  "Absurd future history / ancient prophecy",
  "Fake science / karma / cosmic alignment",
  "Overdramatic, petty consequence if they refuse",
  "Ridiculous personal sacrifice or bribe",
  "Unexpected animal or inanimate object approval",
];

function pickFallbackBundle(): string[] {
  const arr = [...FALLBACK_REASONS];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function safeParseBundle(text: string): string[] | null {
  // Strip markdown code fences if Gemini wraps output
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    // Support both {"reasons": ["..."]} and ["..."]
    const list = Array.isArray(parsed) ? parsed : parsed?.reasons;

    if (
      Array.isArray(list) &&
      list.length >= 3 &&
      list.every((r) => typeof r === "string") &&
      list.every((r) => r.trim().length > 0)
    ) {
      return list.slice(0, 3).map((s) => s.trim());
    }
  } catch (err) {
    console.warn("[/api/generate-joke] JSON parse error:", err);
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

    // 1) Check DB cache first
    try {
      const cached = await prisma.question.findUnique({
        where: { normalized },
        include: {
          answers: { orderBy: { createdAt: "desc" } },
        },
      });

      if (cached && cached.answers.length > 0) {
        for (const ans of cached.answers) {
          const parsed = safeParseBundle(ans.content);
          if (parsed) {
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

    // 2) Cache miss → Run AI comedy generator
    let bundle: string[] = [];
    try {
      const avoidList =
        recentBundles.length > 0
          ? recentBundles.slice(-4).join("\n- ")
          : FALLBACK_REASONS.join("\n- ");

      const systemPrompt = `You write short, funny, over-the-top reasons why a friend should say YES to a request.
Tone: playful, friendly, harmless. Avoid dating drama, money pressure, insults, and politics.

Return ONLY valid JSON, no markdown, no preamble:
{"reasons": ["...", "..."]}

Rules:
- Generate exactly 3 reasons.
- Each reason is MAX 90 characters.
- Every reason must use a DIFFERENT comedic angle. Use these angles:
  ${COMEDIC_ANGLES.join("\n  ")}
- No two reasons may start with the same word or share a sentence structure.
- Be specific and absurd, not generic. Concrete details beat vague hype.
- Avoid these (already used), and don't write anything similar:
- ${avoidList}`;

      const userPrompt = `The friend's request is: "${reason}"${
        extraContext ? `\nContext: ${extraContext}` : ""
      }\nGenerate 3 short, punchy reasons (under 90 chars each).`;

      const result = await generateText({
        model: google("gemini-1.5-pro-latest"),
        system: systemPrompt,
        prompt: userPrompt,
        temperature: 1.1,
        maxTokens: 400,
      });

      const parsed = safeParseBundle(result.text);
      bundle = parsed || pickFallbackBundle();
    } catch (aiErr) {
      console.error("[/api/generate-joke] AI generation failed:", aiErr);
      bundle = pickFallbackBundle();
    }

    // 3) Persist bundle into DB Answer cache
    try {
      const dbQuestion = await prisma.question.upsert({
        where: { normalized },
        update: {},
        create: { normalized, original: reason },
      });

      await prisma.answer.create({
        data: {
          questionId: dbQuestion.id,
          content: JSON.stringify({ reasons: bundle }),
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
