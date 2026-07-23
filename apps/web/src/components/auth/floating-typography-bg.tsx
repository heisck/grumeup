"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

interface PhysicsWord {
  id: number;
  text: string;
  font: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
}

const MULTILINGUAL_WORDS = [
  { text: "GrumeUp", font: "font-sans font-black tracking-widest text-base sm:text-2xl" },
  { text: "Gumi App", font: "font-mono font-bold text-sm sm:text-xl" },
  { text: "欢迎", font: "font-serif font-extrabold text-base sm:text-2xl" },
  { text: "Group Interview", font: "font-sans font-medium italic text-sm sm:text-lg" },
  { text: "स्वागत है", font: "font-sans font-bold text-sm sm:text-xl" },
  { text: "Bienvenue", font: "font-serif italic font-semibold text-sm sm:text-xl" },
  { text: "グループ", font: "font-sans font-black text-base sm:text-2xl" },
  { text: "أهلاً بك", font: "font-serif font-bold text-sm sm:text-xl" },
  { text: "Queue System", font: "font-mono tracking-tighter text-sm sm:text-lg" },
  { text: "Bienvenido", font: "font-sans font-semibold text-sm sm:text-lg" },
  { text: "Добро пожаловать", font: "font-serif italic text-sm sm:text-lg" },
  { text: "Willkommen", font: "font-mono font-bold text-sm sm:text-xl" },
  { text: "환영합니다", font: "font-sans font-extrabold text-base sm:text-2xl" },
  { text: "Next Group", font: "font-mono font-semibold text-sm sm:text-lg" },
  { text: "Benvenuto", font: "font-serif font-medium text-sm sm:text-lg" },
  { text: "Benvindo", font: "font-sans font-bold text-sm sm:text-lg" },
  { text: "Hoş geldiniz", font: "font-serif font-light text-sm sm:text-xl" },
  { text: "Maligayang pagdating", font: "font-mono text-xs sm:text-base" },
];

const MONOCHROME_THEME_CLASSES = [
  "text-black dark:text-white",
  "text-zinc-900 dark:text-zinc-200",
  "text-zinc-800 dark:text-zinc-300",
  "text-zinc-700 dark:text-zinc-400",
  "text-zinc-600 dark:text-zinc-500",
];

interface Bounds {
  w: number;
  h: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

function computeBounds(): Bounds {
  const w = typeof window !== "undefined" ? window.innerWidth : 1200;
  const h = typeof window !== "undefined" ? window.innerHeight : 800;
  const centerW = Math.min(420, w - 40);
  const centerH = 460;

  return {
    w,
    h,
    minX: (w - centerW) / 2 - 15,
    maxX: (w + centerW) / 2 + 15,
    minY: (h - centerH) / 2 - 15,
    maxY: (h + centerH) / 2 + 15,
  };
}

function updateWallBounce(b: PhysicsWord, bounds: Bounds): void {
  const padding = 10;

  if (b.x <= padding) {
    b.x = padding;
    b.vx = Math.abs(b.vx);
  } else if (b.x + b.width >= bounds.w - padding) {
    b.x = bounds.w - padding - b.width;
    b.vx = -Math.abs(b.vx);
  }

  if (b.y <= padding) {
    b.y = padding;
    b.vy = Math.abs(b.vy);
  } else if (b.y + b.height >= bounds.h - padding) {
    b.y = bounds.h - padding - b.height;
    b.vy = -Math.abs(b.vy);
  }
}

function updateWordCollisions(bodies: PhysicsWord[]): void {
  for (let i = 0; i < bodies.length; i++) {
    const b1 = bodies[i];
    if (!b1) {
      continue;
    }

    for (let j = i + 1; j < bodies.length; j++) {
      const b2 = bodies[j];
      if (!b2) {
        continue;
      }

      const overlapX = Math.min(b1.x + b1.width, b2.x + b2.width) - Math.max(b1.x, b2.x);
      const overlapY = Math.min(b1.y + b1.height, b2.y + b2.height) - Math.max(b1.y, b2.y);

      if (overlapX <= 0 || overlapY <= 0) {
        continue;
      }

      if (overlapX < overlapY) {
        const shift = overlapX / 2;
        if (b1.x < b2.x) {
          b1.x -= shift;
          b2.x += shift;
        } else {
          b1.x += shift;
          b2.x -= shift;
        }
        const tempVx = b1.vx;
        b1.vx = b2.vx;
        b2.vx = tempVx;
      } else {
        const shift = overlapY / 2;
        if (b1.y < b2.y) {
          b1.y -= shift;
          b2.y += shift;
        } else {
          b1.y += shift;
          b2.y -= shift;
        }
        const tempVy = b1.vy;
        b1.vy = b2.vy;
        b2.vy = tempVy;
      }
    }
  }
}

export function FloatingTypographyBg() {
  const wordRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let bounds = computeBounds();

    const handleResize = () => {
      bounds = computeBounds();
    };

    window.addEventListener("resize", handleResize);

    const bodies: PhysicsWord[] = MULTILINGUAL_WORDS.map((item, i) => {
      const el = wordRefs.current[i];
      const w = el?.offsetWidth || (bounds.w < 640 ? 110 : 140);
      const h = el?.offsetHeight || (bounds.w < 640 ? 30 : 40);
      const padding = 20;
      const x = Math.random() * Math.max(10, bounds.w - w - padding * 2) + padding;
      const y = Math.random() * Math.max(10, bounds.h - h - padding * 2) + padding;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 0.9;

      return {
        id: i,
        text: item.text,
        font: item.font,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        width: w,
        height: h,
      };
    });

    const tickerCallback = () => {
      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        if (!b) {
          continue;
        }

        b.x += b.vx;
        b.y += b.vy;

        updateWallBounce(b, bounds);
      }

      updateWordCollisions(bodies);

      for (let i = 0; i < bodies.length; i++) {
        const b = bodies[i];
        if (!b) {
          continue;
        }

        const isInsideCenter =
          b.x + b.width > bounds.minX &&
          b.x < bounds.maxX &&
          b.y + b.height > bounds.minY &&
          b.y < bounds.maxY;

        const el = wordRefs.current[b.id];
        if (el) {
          el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0px)`;
          el.style.opacity = isInsideCenter ? "0" : "0.8";
        }
      }
    };

    gsap.ticker.add(tickerCallback);

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {MULTILINGUAL_WORDS.map((item, index) => (
        <div
          key={item.text}
          ref={(el) => {
            wordRefs.current[index] = el;
          }}
          className={`absolute top-0 left-0 whitespace-nowrap ${item.font} ${
            MONOCHROME_THEME_CLASSES[index % MONOCHROME_THEME_CLASSES.length]
          } transition-opacity duration-150`}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
}
