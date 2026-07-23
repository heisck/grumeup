"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        className:
          "!bg-white dark:!bg-zinc-950 !text-black dark:!text-white !border !border-zinc-200 dark:!border-zinc-800 !rounded-2xl !shadow-xl !font-sans !text-xs !py-3.5 !px-4.5",
      }}
    />
  );
}

export { toast } from "sonner";
