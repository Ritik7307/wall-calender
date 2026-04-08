"use client";

import { motion } from "framer-motion";
import type { DateRange } from "@/types/calendar";

type Props = {
  selectedRange: DateRange;
  onClear: () => void;
};

export function DateRangePicker({ selectedRange, onClear }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-amber-900/20 bg-gradient-to-br from-amber-100/90 via-[#e8dcc8] to-[#d4c4a8] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_24px_rgba(0,0,0,0.12)]"
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/25 blur-2xl"
        aria-hidden
      />
      <h3 className="font-serif text-sm font-semibold text-stone-900">Selection</h3>
      <p className="mt-2 rounded-lg border border-stone-400/40 bg-white/70 px-3 py-2 font-mono text-xs text-stone-800 sm:text-sm">
        {selectedRange.start ? selectedRange.start : "Start"} — {selectedRange.end ? selectedRange.end : "End"}
      </p>
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClear}
        className="mt-3 w-full rounded-lg border border-stone-600/30 bg-stone-900 px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-stone-800 sm:text-sm"
      >
        Clear selection
      </motion.button>
    </motion.div>
  );
}
