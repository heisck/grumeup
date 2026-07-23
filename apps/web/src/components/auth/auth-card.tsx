"use client";

import { AlertCircle, ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/toaster";
import { GoogleSignInButton } from "./google-sign-in-button";
import { OtpInput } from "./otp-input";
import { TypingHeader } from "./typing-header";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type AuthStep = "email" | "password" | "otp";

export function AuthCard() {
  const [step, setStep] = useState<AuthStep>("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (val: string) => {
    setEmail(val);
    setPassword("");
    setStep("email");
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

  const handleCheckEmail = async (e: React.FormEvent) => {
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

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = (await res.json()) as { exists?: boolean; isAdmin?: boolean; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Failed to verify email address.");
        toast.error(data.error ?? "Failed to verify email address.");
        return;
      }

      if (data.isAdmin) {
        setStep("password");
        toast.success("Admin email verified. Please enter your password.");
      } else {
        toast.success("Verification link sent to your email!");
      }
    } catch {
      setError("Network error checking email address.");
      toast.error("Network error checking email address.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError("Please enter your password.");
      toast.error("Please enter your password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string; message?: string };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Invalid password.");
        toast.error(data.error ?? "Invalid password.");
        return;
      }

      setStep("otp");
      toast.success(data.message ?? "Verification code sent to your email!");
    } catch {
      setError("Network error sending verification code.");
      toast.error("Network error sending verification code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        admin?: { name: string };
      };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Invalid verification code.");
        toast.error(data.error ?? "Invalid verification code.");
        return;
      }

      toast.success(`Welcome back, ${data.admin?.name ?? "Admin"}!`);
      window.location.href = "/";
    } catch {
      setError("Network error verifying code.");
      toast.error("Network error verifying code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string; message?: string };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Failed to resend verification code.");
        toast.error(data.error ?? "Failed to resend verification code.");
        return;
      }

      toast.success("New 6-digit verification code sent!");
    } catch {
      setError("Network error resending verification code.");
      toast.error("Network error resending verification code.");
    }
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto z-10 text-center transition-all">
      <TypingHeader />
      <GoogleSignInButton />

      <div className="flex items-center gap-3 my-6 select-none">
        <div className="flex-1 border-t border-zinc-300 dark:border-zinc-800" />
        <span className="text-xs sm:text-sm font-sans font-medium text-zinc-500 dark:text-zinc-400 tracking-wide whitespace-nowrap">
          or continue with email
        </span>
        <div className="flex-1 border-t border-zinc-300 dark:border-zinc-800" />
      </div>

      {step === "otp" ? (
        <OtpInput
          email={email}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          isSubmitting={isLoading}
          error={error}
        />
      ) : (
        <form
          noValidate
          onSubmit={step === "password" ? handleSendOtp : handleCheckEmail}
          className="text-left space-y-4"
        >
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                <Mail className="w-5 h-5" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                disabled={step === "password"}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder=" "
                required
                className={`peer w-full pl-12 pr-5 pt-5 pb-2 bg-white dark:bg-zinc-950 border ${
                  error && step === "email"
                    ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500"
                    : "border-zinc-300 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-600/50"
                } rounded-full text-base text-black dark:text-white transition-all outline-none disabled:opacity-80`}
              />
              <label
                htmlFor="email"
                className="absolute left-12 top-3.5 text-xs sm:text-sm font-sans text-zinc-500 dark:text-zinc-400 duration-200 transform -translate-y-2.5 scale-75 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5 pointer-events-none"
              >
                Email Address
              </label>

              {step === "password" && (
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setPassword("");
                  }}
                  className="absolute right-4 top-4 text-xs font-semibold text-zinc-500 hover:text-black dark:hover:text-white underline transition-colors"
                >
                  Change
                </button>
              )}
            </div>
          </div>

          {step === "password" && (
            <div className="animate-in fade-in-0 slide-in-from-top-3 duration-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder=" "
                  required
                  // biome-ignore lint/a11y/noAutofocus: dynamic password popup focus
                  autoFocus
                  className={`peer w-full pl-12 pr-12 pt-5 pb-2 bg-white dark:bg-zinc-950 border ${
                    error
                      ? "border-red-500 focus:border-red-600 focus:ring-1 focus:ring-red-500"
                      : "border-zinc-300 dark:border-zinc-800 focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-1 focus:ring-zinc-400/50 dark:focus:ring-zinc-600/50"
                  } rounded-full text-base text-black dark:text-white transition-all outline-none`}
                />
                <label
                  htmlFor="password"
                  className="absolute left-12 top-3.5 text-xs sm:text-sm font-sans text-zinc-500 dark:text-zinc-400 duration-200 transform -translate-y-2.5 scale-75 origin-left peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5 pointer-events-none"
                >
                  Admin Password
                </label>

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          )}

          <div className="min-h-5.5 px-4 flex items-center text-xs font-sans">
            {error ? (
              <span className="flex items-center gap-1.5 text-red-500 dark:text-red-400 animate-in fade-in-0 duration-150">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </span>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isLoading || Boolean(error)}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-black font-bold text-sm sm:text-base rounded-full shadow-xs transition-all duration-200 group active:scale-[0.99] disabled:opacity-50"
          >
            <span>{step === "password" ? "Request Verification Code" : "Continue with Email"}</span>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-current" />
            ) : (
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>
      )}
    </div>
  );
}
