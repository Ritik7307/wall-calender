"use client";

import { useCallback, useMemo } from "react";
import { motion } from "framer-motion";

const YEAR_MIN = 1900;
const YEAR_MAX = 2100;

const MONTHS = [
  { value: 0, label: "January" },
  { value: 1, label: "February" },
  { value: 2, label: "March" },
  { value: 3, label: "April" },
  { value: 4, label: "May" },
  { value: 5, label: "June" },
  { value: 6, label: "July" },
  { value: 7, label: "August" },
  { value: 8, label: "September" },
  { value: 9, label: "October" },
  { value: 10, label: "November" },
  { value: 11, label: "December" },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toIsoParts(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return { y, m0: m - 1, d };
}

function buildIso(y: number, m0: number, day: number) {
  return `${y}-${pad(m0 + 1)}-${pad(day)}`;
}

function daysInMonth(y: number, m0: number) {
  return new Date(y, m0 + 1, 0).getDate();
}

type Props = {
  focusedDate: string;
  goToDate: (iso: string) => void;
};

const selectClass =
  "min-h-10 min-w-0 flex-1 rounded-lg border border-stone-400/70 bg-white px-2 py-2 text-sm font-medium text-stone-900 shadow-sm focus:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 sm:min-w-[4.5rem] md:text-base";

export function CalendarJumpControls({ focusedDate, goToDate }: Props) {
  const { y, m0, d } = useMemo(() => toIsoParts(focusedDate), [focusedDate]);
  const dim = useMemo(() => daysInMonth(y, m0), [y, m0]);
  const dayClamped = Math.min(Math.max(1, d), dim);

  const navigate = useCallback(
    (nextY: number, nextM0: number, nextDay: number) => {
      const maxD = daysInMonth(nextY, nextM0);
      const dNext = Math.min(Math.max(1, nextDay), maxD);
      goToDate(buildIso(nextY, nextM0, dNext));
    },
    [goToDate],
  );

  const years = useMemo(
    () => Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MIN + i),
    [],
  );

  const dayOptions = useMemo(() => Array.from({ length: dim }, (_, i) => i + 1), [dim]);

  const nativeValue = buildIso(y, m0, dayClamped);

  return (
    <div
      className="flex w-full flex-col gap-2 border-t border-stone-300/60 bg-[#ebe4d8]/90 px-3 py-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-center sm:gap-3 sm:px-4"
      role="navigation"
      aria-label="Jump to year, month, and day"
    >
      <div className="flex w-full flex-col gap-1 sm:w-auto sm:min-w-[5.5rem]">
        <label htmlFor="cal-jump-year" className="text-[10px] font-semibold uppercase tracking-wide text-stone-600">
          Year
        </label>
        <select
          id="cal-jump-year"
          className={selectClass}
          value={y}
          onChange={(e) => navigate(Number(e.target.value), m0, dayClamped)}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="flex w-full flex-col gap-1 sm:w-auto sm:min-w-[8.5rem]">
        <label htmlFor="cal-jump-month" className="text-[10px] font-semibold uppercase tracking-wide text-stone-600">
          Month
        </label>
        <select
          id="cal-jump-month"
          className={selectClass}
          value={m0}
          onChange={(e) => navigate(y, Number(e.target.value), dayClamped)}
        >
          {MONTHS.map((mo) => (
            <option key={mo.value} value={mo.value}>
              {mo.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex w-full flex-col gap-1 sm:w-auto sm:min-w-[4.5rem]">
        <label htmlFor="cal-jump-day" className="text-[10px] font-semibold uppercase tracking-wide text-stone-600">
          Day
        </label>
        <select
          id="cal-jump-day"
          className={selectClass}
          value={dayClamped}
          onChange={(e) => navigate(y, m0, Number(e.target.value))}
        >
          {dayOptions.map((dayN) => (
            <option key={dayN} value={dayN}>
              {dayN}
            </option>
          ))}
        </select>
      </div>

      <div className="flex w-full items-end gap-2 sm:w-auto">
        <div className="flex min-h-10 flex-1 flex-col justify-end sm:flex-none">
          <span className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-stone-600 sm:sr-only">
            Quick pick
          </span>
          <label htmlFor="cal-jump-native" className="sr-only">
            Pick any date using the date picker
          </label>
          <input
            id="cal-jump-native"
            type="date"
            className={`${selectClass} font-mono text-sm md:text-base`}
            value={nativeValue}
            min={`${YEAR_MIN}-01-01`}
            max={`${YEAR_MAX}-12-31`}
            onChange={(e) => {
              const v = e.target.value;
              if (!v) return;
              const [ny, nm, nd] = v.split("-").map(Number);
              navigate(ny, nm - 1, nd);
            }}
          />
        </div>
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="min-h-10 shrink-0 rounded-lg border border-amber-800/30 bg-amber-200/90 px-3 py-2 text-xs font-bold text-amber-950 shadow-sm hover:bg-amber-300/90 sm:text-sm"
          onClick={() => {
            const t = new Date();
            navigate(t.getFullYear(), t.getMonth(), t.getDate());
          }}
        >
          Today
        </motion.button>
      </div>
    </div>
  );
}
