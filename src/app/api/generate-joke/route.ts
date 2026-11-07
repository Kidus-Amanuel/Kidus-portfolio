import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { normalizeQuestion } from "@/lib/normalizeQuestion";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { getGeminiKeyPool } from "@/lib/ai-provider";

// Memory buffer of recently used reasons to prevent repeating jokes
const recentUsedReasons = new Set<string>();
const MAX_RECENT_TRACK = 30;

// Diverse pool of 25+ punchy, hilarious reasons across all comedic angles (all strictly < 90 chars)
const DIVERSE_FALLBACK_POOL = [
  "Scientifically proven to boost your good karma and strengthen your Wi-Fi signal.",
  "If you say no, I will be forced to take up the accordion out of pure boredom.",
  "I will personally give you a standing ovation every single time you enter a room.",
  "Ancient prophecies specifically predicted you would say yes to this exact request.",
  "My cat had a meeting with the committee and they strongly recommend saying yes.",
  "Saying yes automatically qualifies you for a free high-five and eternal gratitude.",
  "Astronomers confirmed the planets are aligned for maximum enjoyment if you agree.",
  "I promise to dramatically gasp in admiration at whatever outfit you wear.",
  "If you say no, a tiny violin somewhere in the world will play a mournful solo.",
  "Think of this as an investment in our joint comedy routine. High potential yield.",
  "Local historians will mark today as the pinnacle of your generous contributions.",
  "Saying yes will burn roughly 42 calories of pure joy and satisfaction.",
  "I will officially name my next houseplant after you in solemn tribute.",
  "Doctors recommend saying yes at least once a day to prevent acute boredom.",
  "If you agree, you earn 10,000 imaginary bonus points redeemable for bragging rights.",
  "The universe specifically whispered that saying yes will unlock good fortune for you.",
  "I will clap vigorously every time you say anything mildly funny this entire week.",
  "Statistically speaking, 10 out of 10 imaginary experts agree you should say yes.",
  "Refusing this request will cause your horoscope to become strangely confusing.",
  "I have already told my mom you said yes, please do not make me look foolish.",
  "Saying yes is 100% tax-deductible in the currency of friendship and good vibes.",
];

const COMEDIC_ANGLES = [
  "Absurd future history / ancient prophecy",
  "Fake science / karma / cosmic alignment",
  "Overdramatic, petty consequence if they refuse",
  "Ridiculous personal sacrifice or bribe",
  "Unexpected animal or inanimate object approval",
];

function pickUniqueFallbackBundle(avoidList: string[] = []): string[] {
  const available = DIVERSE_FALLBACK_POOL.filter(
    (reason) => !avoidList.includes(reason) && !recentUsedReasons.has(reason)
  );

  const pool = available.length >= 3 ? available : DIVERSE_FALLBACK_POOL;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);

  // Track as recently used
  selected.forEach((r) => {
    recentUsedReasons.add(r);
    if (recentUsedReasons.size > MAX_RECENT_TRACK) {
      const first = recentUsedReasons.values().next().value;
      if (first) recentUsedReasons.delete(first);
    }
  });

  return selected;
}

function safeParseBundle(text: string): string[] | null {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    const list = Array.isArray(parsed) ? parsed : parsed?.reasons;

    if (
      Array.isArray(list) &&
      list.length >= 3 &&
      list.every((r) => typeof r === "string") &&
      list.every((r) => r.trim().length > 0)
    ) {
      return list.slice(0, 3).map((s) => s.trim().slice(0, 95));
    }
  } catch {
    // Return null to trigger fallback
  }
  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const rawReason = String(body?.reason ?? "").trim();
    const extraContext = String(body?.context ?? "").trim().slice(0, 240);
    const forceFresh = body?.fresh === true;

    if (!rawReason) {
      return NextResponse.json(
        { error: "reason is required" },
        { status: 400 }
      );
    }

    const reason = rawReason.slice(0, 200);
    const normalized = normalizeQuestion(reason);

    // 1) If not forcing fresh generation, check if we have multiple cached answers in DB
    if (!forceFresh) {
      try {
        const cached = await prisma.question.findUnique({
          where: { normalized },
          include: {
            answers: { orderBy: { createdAt: "desc" }, take: 10 },
          },
        });

        if (cached && cached.answers.length > 0) {
          // Shuffle through answers to avoid repeating the exact same one!
          const candidateAnswers = cached.answers
            .map((ans) => safeParseBundle(ans.content))
            .filter((bundle): bundle is string[] => bundle !== null);

          // Find a bundle that hasn't been recently displayed
          const freshBundle = candidateAnswers.find(
            (b) => !b.some((r) => recentUsedReasons.has(r))
          );

          const chosen = freshBundle || candidateAnswers[Math.floor(Math.random() * candidateAnswers.length)];

          if (chosen) {
            chosen.forEach((r) => recentUsedReasons.add(r));
            return NextResponse.json({
              reasons: chosen,
              cached: true,
            });
          }
        }
      } catch (dbErr) {
        console.error("[/api/generate-joke] cache lookup error:", dbErr);
      }
    }

    // 2) Generate brand-new reasons using Gemini with key rotation
    const keys = getGeminiKeyPool();
    const avoidArr = Array.from(recentUsedReasons).slice(-6);

    let generatedBundle: string[] | null = null;

    if (keys.length > 0) {
      const systemPrompt = `You write short, funny, over-the-top reasons why a friend should say YES to a request.
Tone: playful, friendly, harmless. Avoid dating drama, money pressure, insults, and politics.

Return ONLY valid JSON, no markdown, no preamble:
{"reasons": ["...", "...", "..."]}

Rules:
- Generate exactly 3 reasons.
- Each reason is MAX 90 characters.
- Every reason must use a DIFFERENT comedic angle:
  ${COMEDIC_ANGLES.join("\n  ")}
- No two reasons may start with the same word or share a sentence structure.
- Be specific and absurd, not generic. Concrete details beat vague hype.
- Never write anything similar to these recently used ones:
- ${avoidArr.length > 0 ? avoidArr.join("\n- ") : "Wi-Fi karma, accordion, standing ovation"}`;

      const userPrompt = `The friend's request is: "${reason}"${
        extraContext ? `\nContext: ${extraContext}` : ""
      }\nGenerate 3 short, punchy reasons (under 90 chars each).`;

      // Try keys in the pool
      for (const apiKey of keys) {
        try {
          const google = createGoogleGenerativeAI({ apiKey });
          // Fast model first, fallback to pro
          const modelName = "gemini-1.5-flash";

          const result = await generateText({
            model: google(modelName),
            system: systemPrompt,
            prompt: userPrompt,
            temperature: 1.25, // Higher temperature = greater comedy variety!
            maxTokens: 350,
          });

          const parsed = safeParseBundle(result.text);
          if (parsed && parsed.length === 3) {
            generatedBundle = parsed;
            console.log("[/api/generate-joke] ✓ AI generation succeeded with key ...", apiKey.slice(-4));
            break;
          }
        } catch (keyErr: any) {
          console.warn("[/api/generate-joke] Key attempt error:", keyErr?.message || keyErr);
        }
      }
    } else {
      console.warn("[/api/generate-joke] No Gemini API keys found in pool, using diverse fallback.");
    }

    // 3) Fallback if AI was unavailable
    const finalBundle = generatedBundle || pickUniqueFallbackBundle(avoidArr);

    // Track recently used
    finalBundle.forEach((r) => {
      recentUsedReasons.add(r);
      if (recentUsedReasons.size > MAX_RECENT_TRACK) {
        const first = recentUsedReasons.values().next().value;
        if (first) recentUsedReasons.delete(first);
      }
    });

    // 4) Persist new bundle in DB so future calls have fresh options
    try {
      const dbQuestion = await prisma.question.upsert({
        where: { normalized },
        update: {},
        create: { normalized, original: reason },
      });

      await prisma.answer.create({
        data: {
          questionId: dbQuestion.id,
          content: JSON.stringify({ reasons: finalBundle }),
        },
      });
    } catch (dbErr) {
      console.error("[/api/generate-joke] cache save error:", dbErr);
    }

    return NextResponse.json({
      reasons: finalBundle,
      cached: false,
      aiGenerated: !!generatedBundle,
    });
  } catch (err: any) {
    console.error("[/api/generate-joke] fatal handler error:", err);
    return NextResponse.json({
      reasons: pickUniqueFallbackBundle(),
      cached: false,
      fallback: true,
    });
  }
}
