"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const TITLE_TEXT = "Welcome boss,";
const SUBTITLE_TEXT = "Sign in to access your interview queue and live schedule.";

export function TypingHeader() {
  const [typedTitle, setTypedTitle] = useState("");
  const [typedSubtitle, setTypedSubtitle] = useState("");
  const [isTitleDone, setIsTitleDone] = useState(false);

  useEffect(() => {
    let titleIndex = 0;
    let subtitleIndex = 0;
    let titleTimer: NodeJS.Timeout | null = null;
    let subtitleTimer: NodeJS.Timeout | null = null;

    // Type Title
    titleTimer = setInterval(() => {
      if (titleIndex < TITLE_TEXT.length) {
        setTypedTitle(TITLE_TEXT.slice(0, titleIndex + 1));
        titleIndex++;
        return;
      }

      if (titleTimer) {
        clearInterval(titleTimer);
      }
      setIsTitleDone(true);

      // Start Subtitle typing after title completes
      subtitleTimer = setInterval(() => {
        if (subtitleIndex < SUBTITLE_TEXT.length) {
          setTypedSubtitle(SUBTITLE_TEXT.slice(0, subtitleIndex + 1));
          subtitleIndex++;
          return;
        }

        if (subtitleTimer) {
          clearInterval(subtitleTimer);
        }
      }, 35);
    }, 60);

    return () => {
      if (titleTimer) {
        clearInterval(titleTimer);
      }
      if (subtitleTimer) {
        clearInterval(subtitleTimer);
      }
    };
  }, []);

  return (
    <div className="mb-5 sm:mb-6 text-center select-none space-y-3 sm:space-y-4">
      {/* Top Logo & GrumeUp Brand Wordmark */}
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        {/* Light Theme Logo Icon (Black GP loop) */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 dark:hidden">
          <Image
            src="/brand-logo-dark.png"
            alt="GrumeUp Icon"
            width={56}
            height={56}
            style={{ width: "auto", height: "auto" }}
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            priority
          />
        </div>

        {/* Dark Theme Logo Icon (Light GP loop) */}
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 hidden dark:block">
          <Image
            src="/brand-logo-light.png"
            alt="GrumeUp Icon"
            width={56}
            height={56}
            style={{ width: "auto", height: "auto" }}
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
            priority
          />
        </div>

        {/* GrumeUp Official Wordmark Image */}
        <div className="relative h-10 sm:h-12 w-40 sm:w-48 shrink-0">
          <Image
            src="/brand-wordmark.png"
            alt="GrumeUp"
            width={192}
            height={48}
            style={{ width: "auto", height: "auto" }}
            className="h-10 sm:h-12 w-auto object-contain dark:invert transition-all"
            priority
          />
        </div>
      </div>

      {/* Typewriter Welcome & Subtitle */}
      <div className="space-y-1">
        <h2 className="text-base sm:text-lg font-bold text-black dark:text-white tracking-tight min-h-6 flex items-center justify-center">
          <span>{typedTitle}</span>
          {!isTitleDone && (
            <span className="inline-block ml-1 w-2 h-4 bg-black dark:bg-white animate-pulse rounded-[1px]" />
          )}
        </h2>

        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-sans min-h-4.5 flex items-center justify-center">
          <span>{typedSubtitle}</span>
          {isTitleDone && (
            <span className="inline-block ml-1 w-1.5 h-3.5 bg-zinc-600 dark:bg-zinc-300 animate-pulse rounded-[1px]" />
          )}
        </p>
      </div>
    </div>
  );
}
