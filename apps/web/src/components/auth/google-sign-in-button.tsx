"use client";

import { useState } from "react";
import { toast } from "@/components/ui/toaster";

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  isLoading?: boolean;
}

export function GoogleSignInButton({ onSuccess, isLoading = false }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading || isLoading) {
      return;
    }

    setLoading(true);
    toast.info("Connecting to Google authentication...");
    try {
      if (onSuccess) {
        onSuccess();
      }
    } finally {
      setLoading(false);
    }
  };

  const isPending = loading || isLoading;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="w-full flex items-center justify-center gap-3 px-5 py-3.5 text-sm font-semibold text-black dark:text-white bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-300 dark:border-zinc-800 rounded-full shadow-xs transition-all duration-200 active:scale-[0.99] disabled:opacity-50"
    >
      <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z"
        />
        <path
          fill="#4285F4"
          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
        />
        <path
          fill="#FBBC05"
          d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
        />
        <path
          fill="#34A853"
          d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
        />
      </svg>
      <span>{isPending ? "Connecting to Google..." : "Continue with Google"}</span>
    </button>
  );
}
