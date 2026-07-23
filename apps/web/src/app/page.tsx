import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 p-6 bg-black text-white relative overflow-hidden select-none">
      <div className="z-10 flex flex-col items-center text-center max-w-2xl gap-5">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white">GrumeUp</h1>

        <p className="text-zinc-400 text-base sm:text-lg max-w-lg leading-relaxed">
          Gumi App student group interview queue, automated time estimation, and PWA push
          notifications.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link
            href="/auth"
            className="flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-zinc-200 text-black font-bold text-sm rounded-xl transition-all duration-200 group active:scale-95"
          >
            <span>Open Authentication Portal</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="flex items-center gap-3 mt-6 text-xs text-zinc-500 font-mono">
          <span>Admin &amp; Student Portals</span>
          &bull;
          <span>PWA Push Notifications</span>
        </div>
      </div>
    </main>
  );
}
