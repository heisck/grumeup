"use client";

import { Loader2 } from "lucide-react";
import { type ClipboardEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";

interface OtpInputProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  isSubmitting: boolean;
  error?: string | null;
}

export function OtpInput({ email, onVerify, onResend, isSubmitting, error }: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [countdown, setCountdown] = useState<number>(60);
  const [isResending, setIsResending] = useState<boolean>(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus first input box on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Countdown timer for "Send Again" resend cooldown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    const numericChar = value.replace(/\D/g, "").slice(-1);
    const newDigits = [...digits];
    newDigits[index] = numericChar;
    setDigits(newDigits);

    if (numericChar && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join("");
    if (fullCode.length === 6 && !newDigits.includes("")) {
      void onVerify(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        setDigits(newDigits);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").trim();
    const numericDigits = pastedText.replace(/\D/g, "").slice(0, 6).split("");

    if (numericDigits.length === 0) return;

    const newDigits = Array(6).fill("");
    for (let i = 0; i < numericDigits.length; i += 1) {
      const char = numericDigits[i];
      if (char !== undefined) {
        newDigits[i] = char;
      }
    }
    setDigits(newDigits);

    const targetIndex = Math.min(numericDigits.length, 5);
    inputRefs.current[targetIndex]?.focus();

    if (numericDigits.length === 6) {
      void onVerify(newDigits.join(""));
    }
  };

  const handleResendClick = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);
    try {
      await onResend();
      setDigits(Array(6).fill(""));
      setCountdown(60);
      inputRefs.current[0]?.focus();
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full space-y-5">
      <div className="text-center space-y-1">
        <h3 className="text-lg font-semibold text-white">Security Verification</h3>
        <p className="text-xs text-zinc-400">
          Enter the 6-digit code sent to <span className="font-medium text-zinc-200">{email}</span>
        </p>
      </div>

      {/* 6 Square Diff Input Boxes */}
      <div className="flex items-center justify-center gap-2 sm:gap-2.5 my-4">
        {digits.map((digit, index) => (
          <input
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed 6-slot OTP grid
            key={`otp-box-${index}`}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isSubmitting}
            style={{ fontSize: "16px" }}
            className="w-10 h-10 sm:w-12 sm:h-12 bg-zinc-950 border border-zinc-800 text-white font-bold text-center rounded-md focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition-all disabled:opacity-50"
            aria-label={`Digit ${index + 1} of 6`}
          />
        ))}
      </div>

      {/* Fixed-height reserved container for layout shift prevention */}
      <div className="min-h-5.5 flex items-center justify-center">
        {error ? (
          <p className="text-xs text-rose-500 text-center font-medium animate-in fade-in duration-200">
            {error}
          </p>
        ) : null}
      </div>

      {/* Resend Code Button with Cooldown Timer */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-zinc-900">
        <span className="text-zinc-500">Didn&apos;t receive the code?</span>
        <button
          type="button"
          onClick={handleResendClick}
          disabled={countdown > 0 || isResending || isSubmitting}
          className="text-white font-medium hover:underline disabled:text-zinc-600 disabled:no-underline transition-colors flex items-center gap-1.5"
        >
          {isResending ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Sending...</span>
            </>
          ) : countdown > 0 ? (
            <span>Send Again ({countdown}s)</span>
          ) : (
            <span>Send Again</span>
          )}
        </button>
      </div>
    </div>
  );
}
