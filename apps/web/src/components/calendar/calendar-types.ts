import type { View } from "react-big-calendar";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: unknown;
  groupId?: string;
  status?: "UPCOMING" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED";
  estimatedWindow?: string;
}

export interface BigCalendarProps {
  events?: CalendarEvent[];
  defaultView?: View;
  defaultDate?: Date;
  onSelectEvent?: (event: CalendarEvent) => void;
  onSelectSlot?: (slotInfo: { start: Date; end: Date; action: string }) => void;
  className?: string;
}
