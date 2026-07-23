"use client";

import { AlertCircle, ArrowRight, Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/toaster";
import { GoogleSignInButton } from "./google-sign-in-button";
import { TypingHeader } from "./typing-header";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthCard() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (!val.trim()) {
      setError("");
      return;
    }

    if (!EMAIL_REGEX.test(val)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      toast.error("Please enter your email address.");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubmitted(true);
    toast.success("Verification link sent to your email!");
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto z-10 text-center transition-all">
      {/* Typewriter Header ("Welcome boss,") */}
      <TypingHeader />

      {/* Google Sign-in Option */}
      <GoogleSignInButton />

      {/* Clean Flex Divider */}
      <div className="flex items-center gap-3 my-6 select-none">
        <div className="flex-1 border-t border-zinc-300 dark:border-zinc-800" />
        <span className="text-xs sm:text-sm font-sans font-medium text-zinc-500 dark:text-zinc-400 tracking-wide whitespace-nowrap">
          or continue with email
        </span>
        <div className="flex-1 border-t border-zinc-300 dark:border-zinc-800" />
      </div>

      {/* Floating Label Email Input Form with Zero-Layout-Shift Inline Error */}
      <form noValidate onSubmit={handleSubmit} className="text-left space-y-4">
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
              <Mail className="w-5 h-5" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              placeholder=" "
              required
              className={`peer w-full pl-12 pr-5 pt-5 pb-2 bg-white dark:bg-zinc-950 border ${
                error
                  ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500"
                  : "border-zinc-300 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-600/50"
              } rounded-full text-base text-black dark:text-white transition-all outline-none`}
            />
            <label
              htmlFor="email"
              className="absolute left-12 top-3.5 text-xs sm:text-sm font-sans text-zinc-500 dark:text-zinc-400 duration-200 transform -translate-y-2.5 scale-75 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5 pointer-events-none"
            >
              Email Address
            </label>
          </div>

          {/* Reserved Fixed-Height Container for Zero-Layout-Shift Inline Error */}
          <div className="min-h-[22px] mt-1.5 px-4 flex items-center text-xs font-sans">
            {error ? (
              <span className="flex items-center gap-1.5 text-red-500 dark:text-red-400 animate-in fade-in-0 duration-150">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </span>
            ) : null}
          </div>
        </div>

        {/* Submit Button (Arrow turns into Spinner on click) */}
        <button
          type="submit"
          disabled={isSubmitted || Boolean(error)}
          className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-black font-bold text-sm sm:text-base rounded-full shadow-xs transition-all duration-200 group active:scale-[0.99] disabled:opacity-50"
        >
          <span>Continue with Email</span>
          {isSubmitted ? (
            <Loader2 className="w-4 h-4 animate-spin text-current" />
          ) : (
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          )}
        </button>
      </form>
    </div>
  );
}
