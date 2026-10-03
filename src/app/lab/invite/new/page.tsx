"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, ExternalLink } from "lucide-react";

export default function LinkGenerator() {
  const [sender, setSender] = useState("");
  const [friend, setFriend] = useState("");
  const [question, setQuestion] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const url = new URL(`${baseUrl}/lab/invite`);
    if (sender) url.searchParams.set("sender", sender);
    if (friend) url.searchParams.set("friend", friend);
    if (question) url.searchParams.set("question", question);

    setGeneratedLink(url.toString());
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#0b0716] text-white selection:bg-violet-500 selection:text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl p-8 border border-white/10 rounded-3xl bg-slate-900/70 backdrop-blur-md relative z-10 shadow-2xl"
      >
        <h1 className="text-3xl font-display font-bold mb-2">
          Invite Generator
        </h1>
        <p className="text-white/60 mb-8">
          Create a playful Yes-Only invite link. Type the question, send it to
          a friend.
        </p>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
              Your Name
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              maxLength={30}
              className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors"
              placeholder="e.g. Kidus"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
              Friend&apos;s Name
            </label>
            <input
              type="text"
              value={friend}
              onChange={(e) => setFriend(e.target.value)}
              maxLength={30}
              className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors"
              placeholder="e.g. Alex"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-2 opacity-50 uppercase tracking-wider">
              The Question
            </label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={120}
              className="w-full bg-transparent border-b border-white/30 py-2 focus:outline-none focus:border-white transition-colors"
              placeholder="e.g. help me move this weekend"
              required
            />
            <p className="text-xs text-white/40 mt-2 italic">
              What are you asking them to do? The AI uses this to write the
              playful reasons.
            </p>
          </div>

          <button
            type="submit"
            className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full p-[1px] font-medium focus:outline-none w-full"
          >
            <span className="absolute inset-[-1000%] animate-[spin_2.5s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#000000_0%,#e5e7eb_50%,#000000_100%)]" />
            <span className="inline-flex h-full w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-white backdrop-blur-3xl transition-colors hover:bg-slate-800">
              Generate Link
            </span>
          </button>
        </form>

        {generatedLink && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-8 pt-8 border-t border-white/10"
          >
            <p className="text-sm font-medium opacity-50 uppercase tracking-wider mb-4">
              Your Link
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={generatedLink}
                className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm text-white/70"
              />
              <button
                onClick={handleCopy}
                className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-green-400 font-medium">
                {copied ? "Copied to clipboard!" : ""}
              </span>
              <a
                href={generatedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity"
              >
                Preview Link <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}