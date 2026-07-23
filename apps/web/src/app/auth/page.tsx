import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/auth-card";
import { FloatingTypographyBg } from "@/components/auth/floating-typography-bg";
import { SplashScreen } from "@/components/splash-screen";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Sign In — GrumeUp Queue System",
  description:
    "Authentication portal for GrumeUp student group interview queue & scheduling system.",
};

export default function AuthPage() {
  return (
    <main className="relative min-h-screen w-full bg-white dark:bg-black text-black dark:text-white flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden select-none transition-colors duration-200">
      {/* Multilingual Splash Screen */}
      <SplashScreen />

      {/* Top Right Theme Toggle (System, Dark, Light) */}
      <ThemeToggle />

      {/* Dynamic Floating Multilingual Typography Background (Physics Collision) */}
      <FloatingTypographyBg />

      {/* Auth Layer */}
      <AuthCard />
    </main>
  );
}
