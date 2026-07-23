"use client";

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import type { ToolbarProps, View } from "react-big-calendar";
import type { CalendarEvent } from "./calendar-types";

export function CalendarToolbar({ label, onNavigate, onView, view }: ToolbarProps<CalendarEvent>) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 mb-4 border-b border-border/40">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate("TODAY")}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          Today
        </button>

        <div className="flex items-center rounded-md border border-border bg-background shadow-xs">
          <button
            type="button"
            onClick={() => onNavigate("PREV")}
            className="p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors border-r border-border"
            aria-label="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate("NEXT")}
            className="p-1.5 hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <span className="text-sm font-semibold tracking-tight text-foreground ml-2">{label}</span>
      </div>

      <div className="flex items-center rounded-lg border border-border p-1 bg-muted/30">
        {(["month", "week", "day", "agenda"] as View[]).map((v) => {
          const isActive = view === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onView(v)}
              className={`px-3 py-1 text-xs font-medium capitalize rounded-md transition-all ${
                isActive
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}
