import { streamText } from 'ai';
import { google } from '@ai-sdk/google';

export const maxDuration = 30;

const SYSTEM_PROMPT = `You are an expert career coach writing a cover letter for Kidus Amanuel.

KIDUS'S BACKGROUND:
- Based in Addis Ababa, Ethiopia (Open to remote/international).
- BSc Electrical and Computer Engineering.
- 3+ years experience building SaaS (Next.js, TypeScript, Supabase, Neon DB, Vercel).
- Currently IT Trainee at Ethiopian Airlines, transitioning to AI Engineering.
- Core Stack: Next.js App Router, React, Tailwind, Framer Motion, Vercel AI SDK.

INSTRUCTIONS:
1. The user will provide a Job Description.
2. Write a highly tailored, professional, and concise cover letter from Kidus's perspective applying for this exact job.
3. Highlight the specific skills from Kidus's background that match the JD.
4. DO NOT invent fake companies, fake metrics, or fake experiences. Stick strictly to his actual background.
5. Keep it under 300 words. Be confident, engaging, and modern.
6. Format with clear paragraphs and line breaks.
7. Do not wrap the response in markdown code blocks. Just return the raw text.`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const result = await streamText({
      model: google('gemini-1.5-pro-latest'), // Using Pro for deeper reasoning and better writing
      system: SYSTEM_PROMPT,
      prompt: `Here is the Job Description:\n\n${prompt}`,
      temperature: 0.7, 
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Cover Letter AI Error:", error);
    return new Response('Error processing request', { status: 500 });
  }
}
