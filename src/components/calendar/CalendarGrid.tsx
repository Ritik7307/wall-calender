"use client";

import { DayCell } from "@/components/calendar/DayCell";
import type { CalendarNote, DateRange } from "@/types/calendar";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Props = {
  currentMonth: Date;
  monthDates: Date[];
  selectedRange: DateRange;
  focusedDate: string;
  notes: CalendarNote[];
  holidays: Map<string, string>;
  toIso: (date: Date) => string;
  onStartDrag: (iso: string) => void;
  onMoveDrag: (iso: string) => void;
  onFocusDate: (iso: string) => void;
  onPointerUp: () => void;
};

export function CalendarGrid({
  currentMonth,
  monthDates,
  selectedRange,
  focusedDate,
  notes,
  holidays,
  toIso,
  onStartDrag,
  onMoveDrag,
  onFocusDate,
  onPointerUp,
}: Props) {
  const noteCountForDate = (iso: string) =>
    notes.filter((note) => {
      if (note.scope === "single") return note.date === iso;
      if (note.rangeStart && note.rangeEnd) return iso >= note.rangeStart && iso <= note.rangeEnd;
      return false;
    }).length;

  return (
    <div
      onPointerUp={onPointerUp}
      className="rounded-lg border border-stone-300/70 bg-[#f7f2ea] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-3 md:p-4"
      role="grid"
      aria-label={`Calendar grid for ${currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}`}
    >
      <div className="mb-1.5 grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="rounded-md bg-gradient-to-b from-[var(--theme-primary)] to-black/35 py-1.5 text-center text-[10px] font-bold uppercase tracking-wider text-white shadow-sm sm:text-xs"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 md:gap-2">
        {monthDates.map((day) => {
          const iso = toIso(day);
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isToday = iso === toIso(new Date());
          const isStart = selectedRange.start === iso;
          const isEnd = selectedRange.end === iso;
          const inRange =
            !!selectedRange.start &&
            !!selectedRange.end &&
            iso >= selectedRange.start &&
            iso <= selectedRange.end;
          return (
            <DayCell
              key={iso}
              day={day}
              iso={iso}
              isCurrentMonth={isCurrentMonth}
              isToday={isToday}
              isFocused={focusedDate === iso}
              isStart={isStart}
              isEnd={isEnd}
              inRange={inRange}
              holidayName={holidays.get(iso)}
              indicatorCount={noteCountForDate(iso)}
              onPointerDown={onStartDrag}
              onPointerEnter={onMoveDrag}
              onFocus={onFocusDate}
            />
          );
        })}
      </div>
    </div>
  );
}
