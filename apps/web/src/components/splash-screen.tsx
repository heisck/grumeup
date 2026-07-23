"use client";

import gsap from "gsap";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const SPLASH_TEXTS = [
  "格鲁姆",
  "ग्रूमअप",
  "グルームアップ",
  "غرووم أب",
  "ГрумАп",
  "그룸업",
  "ยินดีต้อนรับ",
  "Chào mừng",
  "Karibu",
  "Benvenuto",
  "Bienvenido",
];

const BURST_CHARACTERS = [
  "格",
  "鲁",
  "姆",
  "ग",
  "्र",
  "ू",
  "म",
  "ア",
  "ッ",
  "プ",
  "غ",
  "ر",
  "و",
  "Г",
  "р",
  "у",
  "м",
  "그",
  "룸",
  "업",
  "ย",
  "ิ",
  "น",
  "ด",
  "ี",
  "C",
  "h",
  "à",
  "o",
  "K",
  "a",
  "r",
  "i",
  "b",
  "u",
  "B",
  "e",
  "n",
  "v",
  "e",
];

export function SplashScreen({ onComplete }: { onComplete?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinalImage, setIsFinalImage] = useState(false);
  const [isBursting, setIsBursting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const particlesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const finishSplash = useCallback(() => {
    setIsFinished(true);
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  const triggerParticleBurst = useCallback(() => {
    if (!particlesRef.current.length) {
      finishSplash();
      return;
    }

    const timeline = gsap.timeline({
      onComplete: () => {
        finishSplash();
      },
    });

    particlesRef.current.forEach((el, i) => {
      if (!el) {
        return;
      }
      const angle = (i / BURST_CHARACTERS.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distance = 180 + Math.random() * 220;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      timeline.to(
        el,
        {
          x: targetX,
          y: targetY,
          opacity: 0,
          scale: 0.2 + Math.random() * 0.8,
          rotation: (Math.random() - 0.5) * 360,
          duration: 0.85,
          ease: "power3.out",
        },
        0
      );
    });

    if (containerRef.current) {
      timeline.to(
        containerRef.current,
        {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0.55
      );
    }
  }, [finishSplash]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < SPLASH_TEXTS.length) {
        setCurrentIndex(index);
        return;
      }

      clearInterval(interval);
      setIsFinalImage(true);

      // Stop on final image for 1 second, then trigger particle burst
      setTimeout(() => {
        setIsBursting(true);
        triggerParticleBurst();
      }, 1000);
    }, 140);

    return () => clearInterval(interval);
  }, [triggerParticleBurst]);

  if (isFinished) {
    return null;
  }

  const currentText = SPLASH_TEXTS[currentIndex] ?? SPLASH_TEXTS[0] ?? "格鲁姆";

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-black/95 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
    >
      <div className="relative flex flex-col items-center justify-center">
        {!isFinalImage ? (
          <div className="flex flex-col items-center justify-center animate-in fade-in-0 duration-100">
            <span className="text-4xl sm:text-6xl font-black font-sans tracking-tight text-black dark:text-white">
              {currentText}
            </span>
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Final Brand Wordmark Image requested by user */}
            <Image
              alt="GrumeUp"
              width={192}
              height={48}
              priority
              className="h-12 w-auto object-contain dark:invert transition-all scale-110 animate-in zoom-in-95 duration-200"
              src="/brand-wordmark.png"
            />

            {/* Particle Burst Layer */}
            {isBursting &&
              BURST_CHARACTERS.map((char, index) => {
                const particleKey = `particle-burst-${char}-${index + 1}`;
                return (
                  <span
                    key={particleKey}
                    ref={(el) => {
                      particlesRef.current[index] = el;
                    }}
                    className="absolute text-sm font-mono font-bold text-zinc-800 dark:text-zinc-200 pointer-events-none"
                    style={{
                      transform: "translate3d(0, 0, 0)",
                      opacity: 1,
                    }}
                  >
                    {char}
                  </span>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
