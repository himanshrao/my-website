"use client";

import React, { useState } from "react";
import TerminalIntro from "@/components/TerminalIntro";
import Portfolio from "@/components/Portfolio";

export default function Home() {
  const [introCompleted, setIntroCompleted] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const handleComplete = () => {
    setFadeOut(true);
    setTimeout(() => {
      setIntroCompleted(true);
    }, 800); // match duration-700 fade transition
  };

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-[#e1e1e1] select-none font-main">
      {!introCompleted ? (
        <div
          className={`transition-opacity duration-700 ease-out ${
            fadeOut ? "opacity-0" : "opacity-100"
          }`}
        >
          <TerminalIntro onComplete={handleComplete} />
        </div>
      ) : (
        <div className="animate-fade-in duration-1000 ease-in-out">
          <Portfolio />
        </div>
      )}
    </main>
  );
}
