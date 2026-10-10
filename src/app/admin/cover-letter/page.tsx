"use client";
import { useCompletion } from "ai/react";
import { motion } from "framer-motion";
import { FileText, Copy, Loader2, Sparkles, Bot } from "lucide-react";
import { useRef, useEffect, useState } from "react";

export default function CoverLetterBuilder() {
  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion({ api: "/api/cover-letter" });
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the output panel as text streams in
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTo({
        top: outputRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [completion]);

  const copyToClipboard = () => {
    if (!completion) return;
    navigator.clipboard.writeText(completion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold flex items-center gap-3 mb-1">
          <FileText className="w-6 h-6" /> Cover Letter AI
        </h1>
        <p className="text-sm text-white/40">
          Paste a job description — Gemini 1.5 Pro streams a tailored cover
          letter mapping your experience to the role.
        </p>
      </div>

      {/* Two-column layout: input | output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* ── Left: Job Description Input ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="border border-white/10 rounded-3xl bg-white/[0.03] overflow-hidden flex flex-col h-[600px] shadow-2xl">
            {/* Panel header */}
            <div className="p-5 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base flex items-center gap-2">
                  <Bot className="w-5 h-5" /> Job Description
                </h3>
                <p className="text-xs text-white/40 mt-0.5">
                  Paste the full job posting below
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
                <span className="text-xs uppercase tracking-widest opacity-50">
                  Ready
                </span>
              </div>
            </div>

            {/* Textarea */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="flex-1 min-h-0 p-5">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Paste the job description here…"
                  className="w-full h-full bg-transparent border-0 focus:outline-none resize-none text-sm leading-relaxed text-white placeholder:text-white/20"
                  required
                />
              </div>

              {/* Flowing separator */}
              <div className="relative h-px overflow-hidden">
                <div className="absolute inset-0 bg-white/10" />
                <div className="absolute left-0 top-0 h-px w-[40%] animate-flow-right bg-gradient-to-r from-transparent via-white/70 to-transparent" />
                <div className="absolute right-0 top-0 h-px w-[40%] animate-flow-left bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              </div>

              {/* Submit bar */}
              <div className="p-4 bg-black/50 backdrop-blur-md">
                <button
                  type="submit"
                  disabled={isLoading || !input}
                  className="w-full group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none disabled:opacity-40"
                >
                  <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
                  <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-8 text-sm text-white backdrop-blur-3xl transition-colors hover:bg-white/10">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating…
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Generate Cover Letter
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* ── Right: Streaming Output ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="border border-white/10 rounded-3xl bg-white/[0.03] overflow-hidden flex flex-col h-[600px] shadow-2xl">
            {/* Panel header */}
            <div className="p-5 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-base flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Generated Result
                </h3>
                <p className="text-xs text-white/40 mt-0.5">
                  Powered by Gemini 1.5 Pro · Vercel AI SDK
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isLoading && (
                  <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                )}
                <button
                  onClick={copyToClipboard}
                  disabled={!completion}
                  className="text-xs flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 hover:bg-white/10 transition-colors disabled:opacity-30"
                >
                  {copied ? (
                    "Copied!"
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scrollable output */}
            <div
              ref={outputRef}
              className="flex-1 min-h-0 overflow-y-auto p-6 scroll-smooth"
            >
              {completion ? (
                <div className="whitespace-pre-wrap text-sm leading-loose opacity-90">
                  {completion}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <FileText className="w-12 h-12 mb-4 opacity-50" />
                  <p className="max-w-xs text-sm">
                    Your tailored cover letter will stream here in real time.
                  </p>
                </div>
              )}
            </div>

            {/* Flowing separator at bottom */}
            <div className="relative h-px overflow-hidden">
              <div className="absolute inset-0 bg-white/10" />
              <div className="absolute left-0 top-0 h-px w-[40%] animate-flow-right bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              <div className="absolute right-0 top-0 h-px w-[40%] animate-flow-left bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            </div>
            <div className="p-3 bg-black/50 backdrop-blur-md text-center">
              <span className="text-xs text-white/20 uppercase tracking-widest">
                Streaming · Gemini 1.5 Pro
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
