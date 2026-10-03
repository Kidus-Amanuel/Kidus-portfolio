"use client";
import { useChat } from "ai/react";
import { motion } from "framer-motion";
import { Send, Bot, User } from "lucide-react";
import { useRef, useEffect } from "react";

export function AILab() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat();
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // On mount: force the page to start at the top and disable the browser's
  // scroll-restoration (otherwise a reload restores mid-page scroll).
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Auto-scroll to the latest message INSIDE the chat panel only —
  // never the window. Skips the initial empty state so first paint stays
  // at the top of the page.
  useEffect(() => {
    if (messages.length === 0) return;
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div id="ai-lab" className="flex flex-col h-full justify-end relative z-10">
      <h2 className="text-sm font-medium opacity-50 uppercase tracking-widest mb-6">
        AI Lab
      </h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border border-white/10 rounded-3xl bg-white/5 overflow-hidden flex flex-col h-[600px] shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-xl flex items-center gap-2">
              <Bot className="w-6 h-6" /> Ask Kidus (AI)
            </h3>
            <p className="text-sm text-mutedForeground mt-1">Powered by Gemini & Vercel AI SDK.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs uppercase tracking-widest opacity-50">Online</span>
          </div>
        </div>

        {/* Chat Messages — fixed-height scroll region */}
        <div
          ref={messagesContainerRef}
          className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <Bot className="w-12 h-12 mb-4 opacity-50" />
              <p>Ask anything about my experience, stack, or availability.</p>
              <div className="flex gap-2 mt-6 flex-wrap justify-center max-w-md">
                {["What is your Next.js experience?", "Are you open to remote work?", "Tell me about your architecture skills."].map(q => (
                  <button
                    key={q}
                    onClick={() => setInput(q)}
                    className="text-xs border border-white/20 rounded-full px-4 py-2 hover:bg-white/10 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(m => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-4 rounded-2xl max-w-[80%] ${
                  m.role === 'user'
                    ? 'bg-white text-black rounded-tr-sm'
                    : 'bg-white/10 text-white rounded-tl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.content}</p>
              </div>
              {m.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </motion.div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-4 items-center opacity-50">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <p className="text-sm animate-pulse">Thinking...</p>
            </div>
          )}
        </div>

        {/* Input Area */}
        <form
          onSubmit={handleSubmit}
          className="bg-black/50 backdrop-blur-md"
        >
          {/* Flowing silver separator between chat and input */}
          <div className="relative h-px overflow-hidden">
            <div className="absolute inset-0 bg-white/10" />
            <div className="absolute left-0 top-0 h-px w-[40%] animate-flow-right bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            <div className="absolute right-0 top-0 h-px w-[40%] animate-flow-left bg-gradient-to-r from-transparent via-white/70 to-transparent" />
          </div>

          <div className="relative p-4">
            <div className="relative">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask a question..."
                className="w-full bg-white/10 border border-white/10 rounded-full pl-6 pr-14 py-4 focus:outline-none focus:border-white/30 transition-colors text-sm text-white placeholder:text-white/30"
              />
              <button
                type="submit"
                disabled={isLoading || !input}
                className="absolute right-2 top-2 bottom-2 w-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}