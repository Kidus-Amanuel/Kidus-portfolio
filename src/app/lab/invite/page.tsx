"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { GameNavbar } from "@/components/lab/GameNavbar";
import { GameFooter } from "@/components/lab/GameFooter";

const noMessages = [
  "No",
  "Are you sure?",
  "Think again",
  "We'll be sad",
  "Last chance!",
  "Fine, Yes!"
];

function InviteContent() {
  const searchParams = useSearchParams();
  
  const sender = searchParams.get("sender") || "Your friend";
  const friend = searchParams.get("friend") || "friend";
  const plan = searchParams.get("plan") || "hang out with us";

  const [noCount, setNoCount] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [noPosition, setNoPosition] = useState({ left: 0, top: 0 });
  
  const noBtnRef = useRef<HTMLButtonElement>(null);

  // Clean inputs (Sanitize basic HTML if react didn't already escape, but React text children escape by default)
  const safeSender = sender.slice(0, 30);
  const safeFriend = friend.slice(0, 30);
  const safePlan = plan.slice(0, 60);

  const handleNo = () => {
    if (noCount >= 5) {
      handleYes();
      return;
    }
    
    // Random position strictly within the viewport
    const padding = 20;
    const btnWidth = noBtnRef.current?.offsetWidth || 100;
    const btnHeight = noBtnRef.current?.offsetHeight || 50;
    
    const maxX = window.innerWidth - btnWidth - padding;
    const maxY = window.innerHeight - btnHeight - padding;

    const left = Math.max(padding, Math.random() * maxX);
    const top = Math.max(padding, Math.random() * maxY);

    setNoPosition({ left, top });
    setNoCount(prev => prev + 1);
  };

  const handleYes = () => {
    setAccepted(true);
    
    // Save to Neon DB in background (does not block UI)
    import("@/app/actions").then(({ acceptInvite }) => {
      acceptInvite({ senderName: safeSender, friendName: safeFriend, plan: safePlan });
    });
    
    // Fire elegant monochrome confetti (respects prefers-reduced-motion in browser OS usually, but we keep it lightweight)
    const end = Date.now() + 3 * 1000;
    const colors = ['#ffffff', '#a3a3a3', '#525252'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const yesScale = 1 + (noCount * 0.15); // button grows slightly each time they try to hit 'No'

  if (accepted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 relative z-10">
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl md:text-7xl font-display font-bold mb-6"
        >
          It's a plan!
        </motion.h1>
        <p className="text-xl text-mutedForeground">
          {safeSender} will send you the details.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 overflow-hidden relative z-10">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-8">
          Hey {safeFriend},
        </h1>
        <p className="text-xl md:text-2xl text-mutedForeground mb-16 max-w-2xl mx-auto leading-relaxed">
          <span className="text-white font-medium">{safeSender}</span> wants to <span className="text-white font-medium">{safePlan}</span>.
        </p>
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center gap-6 z-50 min-h-[100px]">
        <motion.button
          whileHover={{ scale: yesScale * 1.05 }}
          whileTap={{ scale: yesScale * 0.95 }}
          animate={{ scale: yesScale }}
          onClick={handleYes}
          className="bg-white text-black px-12 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-colors shadow-2xl shadow-white/10"
        >
          Yes
        </motion.button>

        <motion.button
          ref={noBtnRef}
          animate={noCount > 0 ? { left: noPosition.left, top: noPosition.top } : {}}
          onHoverStart={handleNo}
          onClick={handleNo} 
          className={`border border-white/20 px-8 py-4 rounded-full font-medium hover:bg-white/5 transition-colors ${
            noCount > 0 ? 'fixed z-50 shadow-xl shadow-black' : 'relative'
          }`}
        >
          {noMessages[Math.min(noCount, noMessages.length - 1)]}
        </motion.button>
      </div>
    </div>
  );
}

export default function InvitePage() {
  return (
    <>
      <GameNavbar />
      <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans relative pt-20">
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white/50 tracking-widest uppercase text-sm">Loading...</div>}>
          <InviteContent />
        </Suspense>
      </main>
      <GameFooter />
    </>
  );
}
