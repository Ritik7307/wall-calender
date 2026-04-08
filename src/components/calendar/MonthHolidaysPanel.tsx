"use client";

import { motion } from "framer-motion";
import type { Holiday } from "@/types/calendar";

type Props = {
  monthLabel: string;
  holidays: Holiday[];
  onGoToDate: (iso: string) => void;
};

function formatHolidayRow(iso: string) {
  const d = new Date(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
  const weekday = d.toLocaleDateString("en-US", { weekday: "short" });
  const md = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return { weekday, md };
}

export function MonthHolidaysPanel({ monthLabel, holidays, onGoToDate }: Props) {
  return (
    <div
      className="rounded-xl border border-amber-800/25 bg-gradient-to-br from-amber-50 via-[#fff8eb] to-amber-100/80 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_20px_rgba(0,0,0,0.06)] sm:p-4"
      role="region"
      aria-label={`Holidays in ${monthLabel}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-sm font-semibold text-stone-900 sm:text-base">
          Holidays this month
        </h2>
        <span className="text-[10px] font-medium uppercase tracking-wide text-amber-900/70 sm:text-xs">
          {holidays.length === 0 ? "No entries" : `${holidays.length} listed`}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-stone-600 sm:text-xs">
        Same dates are highlighted on the grid. Tap a row to jump to that day.
      </p>

      {holidays.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-amber-800/20 bg-white/60 px-3 py-4 text-center text-sm text-stone-600">
          No holidays in our mock list for {monthLabel}. Try January, April, or August.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {holidays.map((h, i) => {
            const { weekday, md } = formatHolidayRow(h.date);
            return (
              <motion.li
                key={h.date}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <button
                  type="button"
                  onClick={() => onGoToDate(h.date)}
                  className="flex w-full touch-manipulation items-start gap-3 rounded-lg border border-amber-900/15 bg-white/80 px-3 py-2.5 text-left shadow-sm transition hover:border-amber-700/35 hover:bg-white hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-700"
                >
                  <span className="flex shrink-0 flex-col items-center rounded-md bg-amber-600 px-2 py-1 text-[10px] font-bold leading-tight text-white sm:text-xs">
                    <span className="tabular-nums">{md}</span>
                    <span className="font-semibold opacity-90">{weekday}</span>
                  </span>
                  <span className="min-w-0 pt-0.5">
                    <span className="block text-sm font-semibold text-stone-900">{h.name}</span>
                    <span className="mt-0.5 font-mono text-[10px] text-stone-500 tabular-nums sm:text-xs">
                      {h.date}
                    </span>
                  </span>
                </button>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
