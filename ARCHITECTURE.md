# AI Architecture

This document explains the architecture of the AI features integrated into this portfolio, designed to be easily explained during technical interviews.

## 1. "Ask Kidus" Assistant

**Goal:** Allow recruiters and founders to instantly get answers about my background without searching through the site.

**Stack:** 
- **Vercel AI SDK** (`ai`, `ai/react`) for managing chat state and streaming.
- **Gemini 1.5 Flash** (`@ai-sdk/google`) for ultra-low latency, high-quality responses.
- **Next.js App Router** for the API endpoint (`/api/chat`).

**How it works:**
1. The user types a message in the `<AILab />` React component.
2. The `useChat` hook sends a POST request to `/api/chat`.
3. The server takes the conversation history, prepends a strict **System Prompt** (acting as the guardrails), and forwards it to the Gemini API.
4. Gemini processes the prompt and streams the response back via the `streamText` function.
5. The UI reads the stream chunk-by-chunk, providing a real-time typing effect.

**Guardrails Implemented:**
- **Topic restriction:** The system prompt explicitly instructs the model to politely decline questions unrelated to my engineering work or portfolio.
- **Hallucination prevention:** The model is instructed to say "I don't know" rather than guess if information isn't in its context.
- **Deterministic output:** The temperature is set to `0.3` to keep responses factual and grounded.

## Next Steps (Future Roadmap)
- **Vector Database (RAG):** Migrating the hardcoded system prompt context into a Supabase/Neon DB `pgvector` implementation, where a script ingests MDX case studies and generates embeddings.
- **Job-Fit Analyzer:** A dedicated route where a user pastes a Job Description, and an LLM returns structured JSON matching my skills to the requirements.
