"use client";

import { useMemo } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCalendar } from "@/hooks/useCalendar";
import { useCalendarStore } from "@/store/calendarStore";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { DateRangePicker } from "@/components/calendar/DateRangePicker";
import { NotesPanel } from "@/components/calendar/NotesPanel";
import { MonthHolidaysPanel } from "@/components/calendar/MonthHolidaysPanel";
import { CalendarJumpControls } from "@/components/calendar/CalendarJumpControls";

const THEMES = [
  { primary: "#0f766e", accent: "#f59e0b", soft: "#ccfbf1", banner: "from-teal-900/90 to-teal-700/75" },
  { primary: "#4338ca", accent: "#ec4899", soft: "#e0e7ff", banner: "from-indigo-900/90 to-indigo-600/75" },
  { primary: "#be123c", accent: "#0ea5e9", soft: "#ffe4e6", banner: "from-rose-900/90 to-rose-600/75" },
  { primary: "#166534", accent: "#f97316", soft: "#dcfce7", banner: "from-green-900/90 to-green-700/75" },
];

export function CalendarWall() {
  const reduceMotion = useReducedMotion();
  const {
    currentMonth,
    selectedRange,
    notes,
    monthMeta,
    holidays,
    holidaysInMonth,
    focusedDate,
    beginRange,
    moveRange,
    endRange,
    addOrUpdateNote,
    deleteNote,
    nextMonth,
    prevMonth,
    jumpByDays,
    setFocusedDate,
    goToDate,
    toIso,
  } = useCalendar();
  const setSelectedRange = useCalendarStore((state) => state.setSelectedRange);

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const theme = useMemo(() => THEMES[currentMonth.getMonth() % THEMES.length], [currentMonth]);

  return (
    <section
      style={
        {
          "--theme-primary": theme.primary,
          "--theme-accent": theme.accent,
          "--theme-soft": theme.soft,
        } as React.CSSProperties
      }
      className="wall-calendar-scene relative min-h-screen overflow-x-hidden bg-gradient-to-b from-[#c9c2b8] via-[#b8afa3] to-[#a3988c] text-stone-900"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") jumpByDays(1);
        if (e.key === "ArrowLeft") jumpByDays(-1);
        if (e.key === "ArrowDown") jumpByDays(7);
        if (e.key === "ArrowUp") jumpByDays(-7);
      }}
      tabIndex={0}
      aria-label="Interactive wall calendar — use arrow keys to move the selected day"
    >
      {/* Wall vignette + subtle plaster variation */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_50%_35%,transparent_0%,rgba(0,0,0,0.18)_100%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-3 pb-16 pt-6 sm:px-4 sm:pt-10 md:px-6 md:pt-14">
        {/* Hanging hardware */}
        <div className="relative z-10 flex flex-col items-center" aria-hidden>
          <div className="h-2 w-2 rounded-full bg-stone-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ring-2 ring-stone-600/80" />
          <div className="h-6 w-px bg-gradient-to-b from-stone-600 to-stone-500" />
          <div className="flex h-4 w-10 items-center justify-center rounded-full border-2 border-stone-500 bg-gradient-to-b from-stone-300 to-stone-400 shadow-md">
            <div className="h-2 w-6 rounded-full bg-stone-500/40" />
          </div>
          <div className="h-5 w-px bg-gradient-to-b from-stone-500 to-transparent" />
        </div>

        <motion.div
          initial={false}
          animate={
            reduceMotion
              ? {}
              : {
                  y: [0, -3, 0],
                  rotate: [0, 0.25, -0.2, 0],
                }
          }
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-0 w-full max-w-[min(100%,52rem)]"
        >
          {/* Drop shadow on the “floor” */}
          <div
            className="pointer-events-none absolute -bottom-6 left-[8%] right-[8%] h-8 rounded-[50%] bg-black/20 blur-2xl"
            aria-hidden
          />

          <div
            className="calendar-paper-texture relative overflow-hidden rounded-sm border-2 border-[var(--calendar-wall-outline)] shadow-[0_2px_0_rgba(255,255,255,0.65)_inset,0_22px_50px_-12px_rgba(0,0,0,0.45),0_8px_16px_rgba(0,0,0,0.2)] ring-1 ring-black/5"
            style={{ transform: "perspective(1200px) rotateX(1.5deg)" }}
          >
            {/* Top printed banner (wall-calendar hero strip) */}
            <div className={`relative h-32 sm:h-40 md:h-44 bg-gradient-to-br ${theme.banner}`}>
              <Image
                src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1600&q=80"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 100vw, 832px"
                className="object-cover opacity-90 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 top-auto h-px bg-white/20" />
              <div className="relative flex h-full flex-col justify-end p-4 sm:p-5 md:p-6 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/90 sm:text-xs">
                  Wall calendar
                </p>
                <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight drop-shadow sm:text-4xl md:text-5xl">
                  {monthLabel}
                </h1>
                <p className="mt-2 max-w-md text-xs text-white/90 sm:text-sm">
                  Drag across days to select a range, tap to start, then add notes. Arrow keys move the focus.
                </p>
              </div>
            </div>

            {/* Month controls — feel like printed header bar */}
            <div className="flex items-center justify-between gap-2 border-b border-stone-300/80 bg-[#f3eee6] px-3 py-2.5 sm:px-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="touch-manipulation rounded-lg border border-stone-400/60 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-sm transition hover:border-stone-500 hover:shadow md:text-sm"
                onClick={prevMonth}
                aria-label="Previous month"
              >
                ← Prev
              </motion.button>
              <div className="min-w-0 text-center">
                <p className="truncate font-serif text-base font-semibold text-stone-900 sm:text-lg md:text-xl">
                  {monthLabel}
                </p>
                <p className="hidden text-[10px] text-stone-600 sm:block sm:text-xs">Interactive · notes saved locally</p>
              </div>
              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="touch-manipulation rounded-lg border border-stone-400/60 bg-white px-3 py-2 text-xs font-semibold text-stone-800 shadow-sm transition hover:border-stone-500 hover:shadow md:text-sm"
                onClick={nextMonth}
                aria-label="Next month"
              >
                Next →
              </motion.button>
            </div>

            <CalendarJumpControls focusedDate={focusedDate} goToDate={goToDate} />

            <div className="px-2 pb-3 pt-3 sm:px-4 sm:pb-4 sm:pt-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentMonth.getFullYear()}-${currentMonth.getMonth()}`}
                  initial={reduceMotion ? false : { rotateY: 88, opacity: 0, x: 12 }}
                  animate={{ rotateY: 0, opacity: 1, x: 0 }}
                  exit={reduceMotion ? {} : { rotateY: -88, opacity: 0, x: -12 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <CalendarGrid
                    currentMonth={currentMonth}
                    monthDates={monthMeta}
                    selectedRange={selectedRange}
                    focusedDate={focusedDate}
                    notes={notes}
                    holidays={holidays}
                    toIso={toIso}
                    onStartDrag={beginRange}
                    onMoveDrag={moveRange}
                    onFocusDate={setFocusedDate}
                    onPointerUp={endRange}
                  />
                </motion.div>
              </AnimatePresence>

              <div className="mt-4">
                <MonthHolidaysPanel
                  monthLabel={monthLabel}
                  holidays={holidaysInMonth}
                  onGoToDate={goToDate}
                />
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                <DateRangePicker
                  selectedRange={selectedRange}
                  onClear={() => setSelectedRange({ start: null, end: null })}
                />
                <NotesPanel
                  selectedRange={selectedRange}
                  notes={notes}
                  onSave={addOrUpdateNote}
                  onDelete={deleteNote}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
