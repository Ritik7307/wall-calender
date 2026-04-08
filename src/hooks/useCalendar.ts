"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MOCK_HOLIDAYS } from "@/data/holidays";
import { useCalendarStore } from "@/store/calendarStore";
import type { CalendarNote, DateRange, Holiday } from "@/types/calendar";

const STORAGE_KEY = "wall-calendar-state-v1";

const toIso = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const fromIso = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const normalizeRange = (start: string, end: string): DateRange => {
  if (start <= end) return { start, end };
  return { start: end, end: start };
};

/** Move by whole months while clamping day-of-month (e.g. Jan 31 → Feb 28). */
function addMonthsKeepDay(iso: string, deltaMonths: number): Date {
  const d = fromIso(iso);
  const y = d.getFullYear();
  const m = d.getMonth();
  const anchor = new Date(y, m + deltaMonths, 1);
  const dim = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate();
  const day = Math.min(d.getDate(), dim);
  return new Date(anchor.getFullYear(), anchor.getMonth(), day);
}

export function useCalendar() {
  const {
    currentMonth,
    selectedRange,
    dragAnchor,
    notes,
    setCurrentMonth,
    setSelectedRange,
    setDragAnchor,
    setNotes,
  } = useCalendarStore();

  const [focusedDate, setFocusedDate] = useState<string>(toIso(new Date()));

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as {
        selectedRange: DateRange;
        notes: CalendarNote[];
        currentMonth: string;
      };
      setSelectedRange(parsed.selectedRange ?? { start: null, end: null });
      setNotes(parsed.notes ?? []);
      setCurrentMonth(parsed.currentMonth ? fromIso(parsed.currentMonth) : new Date());
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [setCurrentMonth, setNotes, setSelectedRange]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedRange,
        notes,
        currentMonth: toIso(currentMonth),
      }),
    );
  }, [currentMonth, notes, selectedRange]);

  const monthMeta = useMemo(() => {
    const first = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const firstDay = first.getDay();
    const monthLength = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0,
    ).getDate();
    const cells: Date[] = [];
    for (let i = 0; i < firstDay; i += 1) {
      cells.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i - firstDay + 1));
    }
    for (let i = 1; i <= monthLength; i += 1) {
      cells.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }
    while (cells.length % 7 !== 0) {
      const last = cells[cells.length - 1];
      cells.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
    }
    return cells;
  }, [currentMonth]);

  const holidays = useMemo(() => {
    const map = new Map<string, string>();
    MOCK_HOLIDAYS.forEach((h) => map.set(h.date, h.name));
    return map;
  }, []);

  const holidaysInMonth = useMemo((): Holiday[] => {
    const y = currentMonth.getFullYear();
    const m = currentMonth.getMonth();
    return MOCK_HOLIDAYS.filter((h) => {
      const d = fromIso(h.date);
      return d.getFullYear() === y && d.getMonth() === m;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [currentMonth]);

  const beginRange = useCallback(
    (isoDate: string) => {
      setFocusedDate(isoDate);
      setSelectedRange({ start: isoDate, end: isoDate });
      setDragAnchor(isoDate);
    },
    [setDragAnchor, setFocusedDate, setSelectedRange],
  );

  const moveRange = useCallback(
    (isoDate: string) => {
      if (!dragAnchor) return;
      setFocusedDate(isoDate);
      setSelectedRange(normalizeRange(dragAnchor, isoDate));
    },
    [dragAnchor, setFocusedDate, setSelectedRange],
  );

  const endRange = useCallback(() => setDragAnchor(null), [setDragAnchor]);

  const addOrUpdateNote = useCallback(
    (note: CalendarNote) => {
      setNotes(
        notes.some((n) => n.id === note.id)
          ? notes.map((n) => (n.id === note.id ? note : n))
          : [note, ...notes],
      );
    },
    [notes, setNotes],
  );

  const deleteNote = useCallback(
    (id: string) => setNotes(notes.filter((n) => n.id !== id)),
    [notes, setNotes],
  );

  const nextMonth = useCallback(() => {
    const next = addMonthsKeepDay(focusedDate, 1);
    const iso = toIso(next);
    setFocusedDate(iso);
    setSelectedRange({ start: iso, end: iso });
    setCurrentMonth(new Date(next.getFullYear(), next.getMonth(), 1));
  }, [focusedDate, setCurrentMonth, setFocusedDate, setSelectedRange]);

  const prevMonth = useCallback(() => {
    const next = addMonthsKeepDay(focusedDate, -1);
    const iso = toIso(next);
    setFocusedDate(iso);
    setSelectedRange({ start: iso, end: iso });
    setCurrentMonth(new Date(next.getFullYear(), next.getMonth(), 1));
  }, [focusedDate, setCurrentMonth, setFocusedDate, setSelectedRange]);

  const jumpByDays = useCallback(
    (delta: number) => {
      const next = fromIso(focusedDate);
      next.setDate(next.getDate() + delta);
      const iso = toIso(next);
      setFocusedDate(iso);
      setSelectedRange({ start: iso, end: iso });
      setCurrentMonth(new Date(next.getFullYear(), next.getMonth(), 1));
    },
    [focusedDate, setCurrentMonth, setFocusedDate, setSelectedRange],
  );

  const goToDate = useCallback(
    (iso: string) => {
      const d = fromIso(iso);
      setFocusedDate(iso);
      setSelectedRange({ start: iso, end: iso });
      setCurrentMonth(new Date(d.getFullYear(), d.getMonth(), 1));
    },
    [setCurrentMonth, setFocusedDate, setSelectedRange],
  );

  return {
    currentMonth,
    selectedRange,
    notes,
    monthMeta,
    holidays,
    holidaysInMonth,
    focusedDate,
    setFocusedDate,
    beginRange,
    moveRange,
    endRange,
    addOrUpdateNote,
    deleteNote,
    nextMonth,
    prevMonth,
    jumpByDays,
    goToDate,
    toIso,
  };
}
