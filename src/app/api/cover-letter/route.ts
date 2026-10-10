import { streamWithKeyRotation } from '@/lib/ai-provider';

export const maxDuration = 30;
export const runtime = 'nodejs';

function getSystemPrompt(length: 'short' | 'normal') {
  return `You are an expert career coach writing a cover letter for Kidus Amanuel.

KIDUS'S BACKGROUND:
- Based in Addis Ababa, Ethiopia (Open to remote/international).
- BSc Electrical and Computer Engineering.
- 3+ years experience building SaaS (Next.js, TypeScript, Supabase, Neon DB, Vercel).
- Currently IT Trainee at Ethiopian Airlines, transitioning to AI Engineering.
- Core Stack: Next.js App Router, React, Tailwind, Framer Motion, Vercel AI SDK.

INSTRUCTIONS:
1. The user will provide a Job Description.
2. Write a highly tailored, professional, and ${length === 'short' ? 'VERY CONCISE' : 'detailed'} cover letter from Kidus's perspective applying for this exact job.
3. Highlight the specific skills from Kidus's background that match the JD. ${length === 'short' ? 'Get straight to the point on why he is a fit.' : ''}
4. DO NOT invent fake companies, fake metrics, or fake experiences. Stick strictly to his actual background.
5. STRICT LENGTH LIMIT: ${length === 'short' ? 'Keep the entire response under 1000 characters (around 150 words). No fluff, no long introductions.' : 'Keep it under 400 words. Be confident, engaging, and modern.'}
6. Format with clear, short paragraphs and line breaks.
7. Do not wrap the response in markdown code blocks. Just return the raw text.`;
}

export async function POST(req: Request) {
  try {
    const { prompt, length = 'short' } = await req.json();

    if (!prompt) {
      return new Response('Missing prompt', { status: 400 });
    }

    const result = await streamWithKeyRotation({
      modelName: 'gemini-2.5-flash',
      system: getSystemPrompt(length),
      messages: [{ role: 'user', content: `Here is the Job Description:\n\n${prompt}` }],
      temperature: 0.7,
      abortSignal: req.signal,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Cover Letter AI Error:', error);
    return new Response('Error processing request', { status: 500 });
  }
}
