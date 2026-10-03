"use client";
import { useCompletion } from "ai/react";
import { motion } from "framer-motion";
import { FileText, Copy, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function CoverLetterBuilder() {
  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: '/api/cover-letter',
  });
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!completion) return;
    navigator.clipboard.writeText(completion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black p-6 md:p-12 lg:p-24 relative z-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-mutedForeground hover:text-white transition-colors mb-12">
        <ArrowLeft className="w-4 h-4" /> Back to Portfolio
      </Link>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Input Section */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <h1 className="text-4xl font-display font-bold mb-4 flex items-center gap-3">
            <FileText className="w-8 h-8" /> Cover Letter Builder
          </h1>
          <p className="text-mutedForeground mb-8">
            Paste a Job Description below. Gemini 1.5 Pro will instantly stream a highly tailored cover letter mapping my exact Next.js & AI experience to the role.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
            <div className="flex-1 flex flex-col">
              <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">Job Description</label>
              <textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Paste the job description here..."
                className="flex-1 min-h-[300px] w-full bg-white/5 border border-white/10 rounded-2xl p-6 focus:outline-none focus:border-white/30 transition-colors resize-none text-sm leading-relaxed text-white placeholder:text-white/20"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input}
              className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none w-full disabled:opacity-50"
            >
              <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
              <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-white backdrop-blur-3xl transition-colors hover:bg-white/10">
                {isLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing Job Match...</> : "Generate Cover Letter"}
              </span>
            </button>
          </form>
        </motion.div>

        {/* Output Section */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full">
          <div className="h-full min-h-[500px] border border-white/10 rounded-3xl bg-white/5 p-6 md:p-8 flex flex-col relative shadow-2xl">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <h3 className="font-medium opacity-70">Generated Result</h3>
              <button onClick={copyToClipboard} disabled={!completion} className="text-xs flex items-center gap-2 border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors disabled:opacity-30">
                {copied ? "Copied!" : <><Copy className="w-3 h-3" /> Copy Text</>}
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {completion ? (
                <div className="whitespace-pre-wrap text-sm leading-loose opacity-90">
                  {completion}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <FileText className="w-12 h-12 mb-4 opacity-50" />
                  <p className="max-w-xs">Your tailored cover letter will stream here instantly.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
