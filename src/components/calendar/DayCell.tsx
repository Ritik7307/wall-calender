"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type DayCellProps = {
  day: Date;
  iso: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFocused: boolean;
  isStart: boolean;
  isEnd: boolean;
  inRange: boolean;
  holidayName?: string;
  indicatorCount: number;
  onPointerDown: (iso: string) => void;
  onPointerEnter: (iso: string) => void;
  onFocus: (iso: string) => void;
};

export function DayCell({
  day,
  iso,
  isCurrentMonth,
  isToday,
  isFocused,
  isStart,
  isEnd,
  inRange,
  holidayName,
  indicatorCount,
  onPointerDown,
  onPointerEnter,
  onFocus,
}: DayCellProps) {
  const isRangeEndpoint = isStart || isEnd;
  const isHoliday = Boolean(holidayName && isCurrentMonth);

  return (
    <motion.button
      type="button"
      role="gridcell"
      aria-selected={isRangeEndpoint || (inRange && !isRangeEndpoint)}
      aria-current={isToday ? "date" : undefined}
      aria-label={`${iso}${holidayName ? `, holiday: ${holidayName}` : ""}`}
      whileHover={{ scale: isCurrentMonth ? 1.03 : 1 }}
      whileTap={{ scale: isCurrentMonth ? 0.97 : 1 }}
      transition={{ type: "spring", stiffness: 520, damping: 28 }}
      onPointerDown={() => onPointerDown(iso)}
      onPointerEnter={() => onPointerEnter(iso)}
      onFocus={() => onFocus(iso)}
      className={clsx(
        "group relative min-h-[4.25rem] rounded-lg border p-1.5 text-left shadow-sm transition-colors duration-200 touch-manipulation sm:min-h-[5.25rem] sm:p-2 md:min-h-24",
        // Adjacent month: clearly muted
        !isCurrentMonth && "border-stone-200/80 bg-stone-200/50 text-stone-500",
        // Current month: strong readable ink on warm paper
        isCurrentMonth &&
          !inRange &&
          !isRangeEndpoint &&
          !isHoliday &&
          "border-stone-300/90 bg-[#fffefb] text-stone-900 hover:border-stone-400 hover:bg-white hover:shadow-md",
        isHoliday &&
          !inRange &&
          !isRangeEndpoint &&
          "border-amber-500/55 bg-gradient-to-br from-amber-50/95 to-[#fffefb] text-stone-900 shadow-sm ring-1 ring-amber-400/35 hover:border-amber-600/70 hover:shadow-md",
        isCurrentMonth &&
          inRange &&
          !isRangeEndpoint &&
          "border-[var(--theme-primary)]/40 bg-[var(--theme-soft)] text-stone-900 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]",
        isRangeEndpoint &&
          "z-[1] border-[var(--theme-primary)] bg-[var(--theme-primary)] text-white shadow-md ring-2 ring-white/50",
        isToday && !isRangeEndpoint && "ring-2 ring-[var(--theme-accent)] ring-offset-2 ring-offset-[#f7f2ea]",
        isToday && isRangeEndpoint && "ring-2 ring-[var(--theme-accent)] ring-offset-2 ring-offset-white/30",
        isFocused && isCurrentMonth && "ring-2 ring-stone-900/25 ring-offset-2 ring-offset-[#f7f2ea]",
      )}
    >
      {isHoliday && !isRangeEndpoint && !inRange ? (
        <span
          className="absolute left-1 top-1 rounded px-1 py-px text-[8px] font-bold uppercase tracking-wide text-amber-950 bg-amber-300/90 shadow-sm sm:left-1.5 sm:top-1.5 sm:text-[9px]"
          aria-hidden
        >
          Holiday
        </span>
      ) : null}
      <span
        className={clsx(
          "inline-flex h-6 min-w-6 items-center justify-center rounded-md text-sm font-semibold tabular-nums sm:text-base",
          isHoliday && !inRange && !isRangeEndpoint && "mt-3 sm:mt-3.5",
          isRangeEndpoint && "bg-white/15",
          !isRangeEndpoint && isCurrentMonth && "font-bold text-stone-900",
          !isCurrentMonth && "font-medium text-stone-500",
        )}
      >
        {day.getDate()}
      </span>
      {holidayName ? (
        <span
          className={clsx(
            "mt-0.5 line-clamp-2 block text-[9px] font-semibold leading-tight sm:text-[10px]",
            isRangeEndpoint ? "text-amber-100" : "text-amber-900",
          )}
        >
          {holidayName}
        </span>
      ) : null}
      {indicatorCount > 0 ? (
        <span className="absolute bottom-1.5 right-1.5 flex gap-0.5 sm:bottom-2 sm:right-2 sm:gap-1" aria-hidden>
          {Array.from({ length: Math.min(indicatorCount, 3) }).map((_, idx) => (
            <span
              key={`${iso}-${idx}`}
              className={clsx(
                "h-1.5 w-1.5 rounded-full sm:h-2 sm:w-2",
                isRangeEndpoint ? "bg-[var(--theme-accent)]" : "bg-[var(--theme-primary)]",
              )}
            />
          ))}
        </span>
      ) : null}
    </motion.button>
  );
}
