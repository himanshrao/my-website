"use client";

import React, { useState, useEffect } from "react";
import { ChevronsRightIcon } from "./Icons";

interface TerminalIntroProps {
  onComplete: () => void;
}

export default function TerminalIntro({ onComplete }: TerminalIntroProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);

  const promptHeader = "himanshu@paytm-prod-bastion:~$ ";

  useEffect(() => {
    // Blinking cursor
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const typeCommand = (cmd: string, nextStep: number, delayBefore = 500) => {
      timer = setTimeout(() => {
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          if (charIndex < cmd.length) {
            setCurrentPrompt((prev) => prev + cmd[charIndex]);
            charIndex++;
          } else {
            clearInterval(typeInterval);
            // Finished typing command
            setTimeout(() => {
              setLines((prev) => [...prev, promptHeader + cmd]);
              setCurrentPrompt("");
              setAnimationStep(nextStep);
            }, 300);
          }
        }, 50);
      }, delayBefore);
    };

    switch (animationStep) {
      case 0:
        // Type "pwd"
        typeCommand("pwd", 1, 500);
        break;
      case 1:
        // Output for pwd, then move to step 2
        setLines((prev) => [...prev, "/home/himanshu/Documents"]);
        setAnimationStep(2);
        break;
      case 2:
        // Type "cd portfolio"
        typeCommand("cd portfolio", 3, 500);
        break;
      case 3:
        // Move directory, no print output, go straight to step 4
        setAnimationStep(4);
        break;
      case 4:
        // Type "ls"
        typeCommand("ls", 5, 500);
        break;
      case 5:
        // Output for ls
        setLines((prev) => [
          ...prev,
          "node_modules/  package-lock.json  public/  src/  index.html  package.json  postcss.config.js  README.md  tailwind.config.ts  tsconfig.json  vite.config.ts  my-website",
        ]);
        setAnimationStep(6);
        break;
      case 6:
        // Type "npm run dev"
        typeCommand("npm run dev", 7, 700);
        break;
      case 7:
        // Server outputs
        timer = setTimeout(() => {
          setLines((prev) => [...prev, "Server starting..."]);
          timer = setTimeout(() => {
            setLines((prev) => [...prev, "Server listening on http://localhost:3000"]);
            // End animation after a short delay
            timer = setTimeout(() => {
              onComplete();
            }, 1200);
          }, 800);
        }, 500);
        break;
      default:
        break;
    }

    return () => clearTimeout(timer);
  }, [animationStep]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[#0c0c0c] p-6 font-terminal text-[#89ff69] md:p-20 lg:p-28 select-none">
      <div className="flex flex-col gap-3 text-lg md:text-xl leading-relaxed">
        {/* Render previous command outputs */}
        {lines.map((line, idx) => {
          const isCommand = line.startsWith("himanshu@");
          return (
            <div key={idx} className="flex flex-col gap-1">
              {isCommand ? (
                <div className="flex gap-2">
                  <span className="font-bold text-[#f2ff5b]">
                    {line.slice(0, promptHeader.length)}
                  </span>
                  <span>{line.slice(promptHeader.length)}</span>
                </div>
              ) : (
                <div className="text-[#e1e1e1] opacity-90 pl-2">{line}</div>
              )}
            </div>
          );
        })}

        {/* Render current typing command */}
        {animationStep !== 7 && (
          <div className="flex gap-2">
            <span className="font-bold text-[#f2ff5b]">{promptHeader}</span>
            <span>
              {currentPrompt}
              <span
                className={`inline-block w-[10px] h-[18px] bg-[#89ff69] ml-1 align-middle ${
                  showCursor ? "opacity-100" : "opacity-0"
                }`}
              ></span>
            </span>
          </div>
        )}
      </div>

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute bottom-12 right-6 md:right-20 flex items-center gap-2 text-sm text-[#c9c9c9] hover:text-[#f2ff5b] transition-colors cursor-pointer border border-[#c9c9c9]/30 rounded px-3 py-1 hover:border-[#f2ff5b]/50"
      >
        <span>Skip Animation</span>
        <ChevronsRightIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
