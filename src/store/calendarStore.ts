"use client";

import { create } from "zustand";
import type { CalendarNote, DateRange } from "@/types/calendar";

type CalendarState = {
  currentMonth: Date;
  selectedRange: DateRange;
  dragAnchor: string | null;
  notes: CalendarNote[];
  setCurrentMonth: (next: Date) => void;
  setSelectedRange: (range: DateRange) => void;
  setDragAnchor: (anchor: string | null) => void;
  setNotes: (notes: CalendarNote[]) => void;
};

export const useCalendarStore = create<CalendarState>((set) => ({
  currentMonth: new Date(),
  selectedRange: { start: null, end: null },
  dragAnchor: null,
  notes: [],
  setCurrentMonth: (next) => set({ currentMonth: next }),
  setSelectedRange: (range) => set({ selectedRange: range }),
  setDragAnchor: (anchor) => set({ dragAnchor: anchor }),
  setNotes: (notes) => set({ notes }),
}));
