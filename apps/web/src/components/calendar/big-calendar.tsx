"use client";

import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { CalendarToolbar } from "./calendar-toolbar";
import type { BigCalendarProps } from "./calendar-types";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function BigCalendar({
  events = [],
  defaultView = Views.MONTH,
  defaultDate = new Date(),
  onSelectEvent,
  onSelectSlot,
  className = "",
}: BigCalendarProps) {
  const components = useMemo(
    () => ({
      toolbar: CalendarToolbar,
    }),
    []
  );

  return (
    <div
      className={`w-full h-[700px] p-4 bg-card rounded-xl border border-border shadow-xs ${className}`}
    >
      <Calendar
        localizer={localizer}
        events={events}
        defaultView={defaultView}
        defaultDate={defaultDate}
        selectable
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        components={components}
        className="grumeup-big-calendar font-sans text-sm"
      />
    </div>
  );
}
