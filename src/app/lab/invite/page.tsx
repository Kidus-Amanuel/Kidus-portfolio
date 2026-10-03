"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { GameNavbar } from "@/components/lab/GameNavbar";
import { GameFooter } from "@/components/lab/GameFooter";

// Three.js scene is heavy — load it only on the client
const GameScene = dynamic(
  () => import("@/components/lab/GameScene").then((m) => m.GameScene),
  { ssr: false, loading: () => null }
);

// Fallback reasons used for slides #2 and #3 if the AI call fails
const FALLBACK_REASONS = [
  "I will be a better person because of this. Probably. Possibly. Ask me in a week.",
  "You were probably going to do something less interesting instead. Be honest.",
  "Think of this as an investment. The investment is me. The returns are currently unavailable. Trust the process.",
];

// Shown when the user keeps clicking NO during the YES/NO round
const NO_MESSAGES = [
  "No",
  "Are you sure?",
  "Think again",
  "We'll be sad",
  "Last chance!",
  "Fine, Yes!",
];

const LOADING_MESSAGES = [
  "Consulting the financial experts...",
  "The experts are currently arguing...",
  "Okay, I asked AI. It agrees with me. Obviously.",
];

// The 3-slide presentation phases
type Phase = "intro" | "reasons" | "ask" | "done";

function InviteContent() {
  const searchParams = useSearchParams();

  const sender = searchParams.get("sender") || "Your friend";
  const friend = searchParams.get("friend") || "friend";
  // Accept either "question" (new) or "plan" (back-compat)
  const question =
    searchParams.get("question") || searchParams.get("plan") || "";

  const [phase, setPhase] = useState<Phase>("intro");
  const [slideIndex, setSlideIndex] = useState(0); // 0, 1, 2
  // The 3 reasons will be filled in by the AI after the user clicks Next on
  // the intro. Until then, render empty placeholders (the slide shows the
  // loading state anyway).
  const [reasons, setReasons] = useState<string[]>(["", "", ""]);
  const [reasonsLoading, setReasonsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState({ left: 0, top: 0 });
  const noBtnRef = useRef<HTMLButtonElement>(null);

  const safeSender = sender.slice(0, 30);
  const safeFriend = friend.slice(0, 30);
  const safeQuestion = question.slice(0, 120);

  // Fire confetti and accept
  const handleYes = () => {
    if (phase === "done") return;
    setPhase("done");

    import("@/app/actions").then(({ acceptInvite }) => {
      acceptInvite({
        senderName: safeSender,
        friendName: safeFriend,
        plan: safeQuestion,
      });
    });

    const end = Date.now() + 3 * 1000;
    const colors = ["#cbd5e1", "#a5b4fc", "#a78bfa", "#7c5cff", "#ffffff"];

    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  // Kick off the AI fetch as soon as the user advances from intro.
  // The API returns 3 reasons, all tailored to the actual question.
  const fetchAiReasons = async () => {
    if (!safeQuestion) {
      // No question provided → use the fallbacks so we always have something
      setReasons([FALLBACK_REASONS[0], FALLBACK_REASONS[1], FALLBACK_REASONS[2]]);
      return;
    }
    setReasonsLoading(true);
    let i = 0;
    const tick = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[i]);
    }, 1400);

    try {
      const res = await fetch("/api/generate-joke", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reason: safeQuestion,
          context:
            "Year 2026. Lighthearted, friendly tone. Convince a friend to help with the request above.",
        }),
      });
      const data = await res.json();
      const reasonsFromApi: string[] = Array.isArray(data?.reasons)
        ? data.reasons
        : [];
      if (reasonsFromApi.length >= 3) {
        setReasons(reasonsFromApi);
      } else {
        // Pad with fallbacks if the AI returned fewer than 3
        const padded = [...reasonsFromApi];
        while (padded.length < 3) {
          padded.push(FALLBACK_REASONS[padded.length % FALLBACK_REASONS.length]);
        }
        setReasons(padded);
      }
    } catch {
      setReasons([FALLBACK_REASONS[0], FALLBACK_REASONS[1], FALLBACK_REASONS[2]]);
    } finally {
      clearInterval(tick);
      setReasonsLoading(false);
    }
  };

  // Move from intro to reasons
  const handleIntroNext = () => {
    setPhase("reasons");
    setSlideIndex(0);
    fetchAiReasons();
  };

  // Move to next slide in the presentation
  const handleSlideNext = () => {
    if (slideIndex < 2) {
      setSlideIndex((s) => s + 1);
    } else {
      setPhase("ask");
    }
  };

  // The "NO" handler — dodge + show why popup + auto-YES after 6
  const handleNo = () => {
    if (phase !== "ask") return;

    // 6th+ NO → just accept
    if (noCount >= 5) {
      handleYes();
      return;
    }

    setNoCount((c) => c + 1);

    // Move NO button to a random position
    const padding = 20;
    const btnWidth = noBtnRef.current?.offsetWidth || 100;
    const btnHeight = noBtnRef.current?.offsetHeight || 50;
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;
    const left = Math.max(padding, Math.random() * maxX);
    const top = Math.max(padding, Math.random() * maxY);
    setNoPosition({ left, top });
  };

  const yesScale = 1 + noCount * 0.15;
  const noScale = Math.max(0.35, 1 - noCount * 0.15);

  // ---------- DONE (final screen) ----------
  if (phase === "done") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10">
        <motion.h1
          initial={{ scale: 0.5, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: -2 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="text-5xl md:text-8xl font-display font-black mb-6 text-white drop-shadow-2xl"
        >
          I KNEW YOU&apos;D SAY YES. 🎉
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-xl md:text-2xl text-white/80 max-w-xl font-medium"
        >
          Thank you for your contribution to my future empire.
        </motion.p>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-base text-white/50 mt-3 italic"
        >
          (Just kidding. But also not.) 😂
        </motion.p>
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          onClick={() => window.location.reload()}
          className="mt-10 bg-white/95 text-violet-700 px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl"
        >
          Start Again 🔁
        </motion.button>
      </div>
    );
  }

  // ---------- INTRO (show the question, Next to reasons) ----------
  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden relative z-10 pt-24 pb-32">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-xs md:text-sm font-medium uppercase tracking-[0.3em] text-white/50 mb-4">
            Hey {safeFriend}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-black text-white leading-[0.95]">
            {safeSender}
            <br />
            <span className="inline-block bg-gradient-to-r from-indigo-300 via-purple-300 to-violet-300 bg-clip-text text-transparent">
              has a question.
            </span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 30, opacity: 0, rotate: -1 }}
          animate={{ y: 0, opacity: 1, rotate: -1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 mb-10 bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-2xl border border-white/10 max-w-2xl mx-auto"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-300/70 mb-3">
            {safeSender} is asking
          </p>
          <p className="text-2xl md:text-3xl font-display font-bold text-white leading-tight">
            <span className="bg-gradient-to-r from-indigo-300 to-violet-300 bg-clip-text text-transparent">
              {safeQuestion || "help out a friend"}
            </span>
            <span className="text-white/60">?</span>
          </p>
        </motion.div>

        {/* "Why?" lead-in — sets up the user to expect the 3 reasons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-center max-w-2xl mx-auto"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-300/70 mb-2">
            Why?
          </p>
          <p className="text-base md:text-lg text-white/60 italic">
            Let me show you three reasons. Hit next →
          </p>
        </motion.div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={handleIntroNext}
          className="bg-white/10 hover:bg-white/20 text-white px-10 py-3 rounded-full font-bold text-base hover:scale-105 transition-all border border-white/15 backdrop-blur-md"
        >
          Next →
        </motion.button>
      </div>
    );
  }

  // ---------- REASONS (3 slides) ----------
  if (phase === "reasons") {
    const currentReason = reasons[slideIndex];
    const isLoading = slideIndex === 0 && reasonsLoading;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden relative z-10 pt-24 pb-32">
        <p className="text-xs md:text-sm font-medium uppercase tracking-[0.3em] text-white/50 mb-4">
          Why you should
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={slideIndex}
            initial={{ opacity: 0, x: 40, rotate: -2 }}
            animate={{ opacity: 1, x: 0, rotate: 1 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
            className="bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border border-white/10 max-w-2xl mx-auto"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-violet-300/80 mb-4">
              Reason #{slideIndex + 1}
            </p>
            {isLoading ? (
              <div className="min-h-[120px] flex flex-col items-start justify-center">
                <p className="text-3xl md:text-4xl font-display font-bold text-white/80 mb-3">
                  🤔
                </p>
                <p className="text-sm text-violet-200/80 italic animate-pulse">
                  {loadingMessage}
                </p>
              </div>
            ) : (
              <p className="text-2xl md:text-3xl font-display font-bold text-white leading-snug">
                {currentReason}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex gap-2 mt-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === slideIndex
                  ? "w-8 bg-violet-400"
                  : i < slideIndex
                  ? "w-1.5 bg-white/40"
                  : "w-1.5 bg-white/15"
              }`}
            />
          ))}
        </div>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleSlideNext}
          disabled={isLoading}
          className="mt-10 bg-white/10 hover:bg-white/20 text-white px-10 py-3 rounded-full font-bold text-base hover:scale-105 transition-all border border-white/15 backdrop-blur-md disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {slideIndex < 2 ? "Next reason →" : "Alright, ask me →"}
        </motion.button>
      </div>
    );
  }

  // ---------- ASK (YES / NO) ----------
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden relative z-10 pt-24 pb-32">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <p className="text-xs md:text-sm font-medium uppercase tracking-[0.3em] text-white/50 mb-4">
          So, {safeFriend}
        </p>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-white leading-[0.95] mb-2">
          Will you{" "}
          <span className="inline-block bg-gradient-to-r from-indigo-300 via-purple-300 to-violet-300 bg-clip-text text-transparent">
            {safeQuestion || "help out"}
          </span>
          ?
        </h2>
      </motion.div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-6 z-50 min-h-[120px] mt-10">
        <motion.button
          whileHover={{ scale: yesScale * 1.08, rotate: 2 }}
          whileTap={{ scale: yesScale * 0.95 }}
          animate={{ scale: yesScale, rotate: -1 }}
          onClick={handleYes}
          className="bg-gradient-to-br from-violet-500 to-indigo-600 text-white px-14 md:px-20 py-4 md:py-5 rounded-full font-black text-xl md:text-2xl shadow-2xl shadow-violet-500/30 hover:shadow-violet-500/60 transition-shadow border border-white/10"
        >
          YES
        </motion.button>

        <motion.button
          ref={noBtnRef}
          animate={
            noCount > 0
              ? {
                  left: noPosition.left,
                  top: noPosition.top,
                  scale: noScale,
                  rotate: ((noCount * 37) % 30) - 15,
                }
              : {}
          }
          onHoverStart={handleNo}
          onClick={handleNo}
          className={`bg-white/8 backdrop-blur-md text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-medium text-base md:text-lg hover:bg-white/15 transition-colors shadow-xl border border-white/15 ${
            noCount > 0 ? "fixed z-50 shadow-2xl" : "relative"
          }`}
        >
          {NO_MESSAGES[Math.min(noCount, NO_MESSAGES.length - 1)]}
        </motion.button>
      </div>

      {/* NO counter — 6 dots that fill as the user tries to escape */}
      {phase === "ask" && (
        <div className="mt-10 flex items-center justify-center gap-3 z-10">
          <span className="text-[10px] uppercase tracking-widest text-white/40">
            No
          </span>
          <div className="flex gap-1.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                initial={false}
                animate={{ scale: i < noCount ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i < noCount ? "bg-rose-400" : "bg-white/15"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-white/40 tabular-nums">
            {noCount}/6
          </span>
        </div>
      )}
    </div>
  );
}

export default function InvitePage() {
  return (
    <>
      <GameNavbar />
      <main className="min-h-screen relative font-sans overflow-hidden bg-[#0b0716]">
        {/* Soft radial gradient base — dark with a hint of violet */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,92,255,0.18),_transparent_55%),_radial-gradient(ellipse_at_bottom_right,_rgba(99,102,241,0.12),_transparent_60%)]" />

        {/* Three.js floating objects */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
          <Suspense fallback={null}>
            <GameScene />
          </Suspense>
        </div>

        {/* Content */}
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center text-white/60 text-sm uppercase tracking-widest relative z-10">
              Loading...
            </div>
          }
        >
          <InviteContent />
        </Suspense>
      </main>
      <GameFooter />
    </>
  );
}