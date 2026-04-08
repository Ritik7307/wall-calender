"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { CalendarNote, DateRange, NoteScope } from "@/types/calendar";

type Props = {
  selectedRange: DateRange;
  notes: CalendarNote[];
  onSave: (note: CalendarNote) => void;
  onDelete: (id: string) => void;
};

const COLORS = ["#fde68a", "#bfdbfe", "#fecaca", "#bbf7d0", "#f5d0fe"];

export function NotesPanel({ selectedRange, notes, onSave, onDelete }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scope, setScope] = useState<NoteScope>("single");

  const defaultTarget = useMemo(() => {
    const { start, end } = selectedRange;
    if (!start) return null;
    return scope === "single" ? { date: start, rangeStart: null, rangeEnd: null } : { date: null, rangeStart: start, rangeEnd: end ?? start };
  }, [scope, selectedRange]);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setScope("single");
  };

  const submit = () => {
    if (!title.trim() || !defaultTarget) return;
    onSave({
      id: editingId ?? crypto.randomUUID(),
      title: title.trim(),
      content: content.trim(),
      scope,
      date: defaultTarget.date,
      rangeStart: defaultTarget.rangeStart,
      rangeEnd: defaultTarget.rangeEnd,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      position: { x: 0, y: 0 },
    });
    resetForm();
  };

  const startEdit = (note: CalendarNote) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setScope(note.scope);
  };

  return (
    <div className="space-y-4">
      <div className="relative rounded-xl border border-stone-400/40 bg-[#fffefb] p-4 shadow-inner">
        <div
          className="pointer-events-none absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-red-800/80 shadow-sm ring-1 ring-black/20"
          aria-hidden
        />
        <h3 className="mt-3 font-serif text-sm font-semibold text-stone-900">Add note</h3>
        <div className="mt-3 flex gap-2 text-xs">
          <button
            type="button"
            onClick={() => setScope("single")}
            className={`rounded-md px-2 py-1 font-medium ${scope === "single" ? "bg-stone-900 text-white shadow-sm" : "bg-stone-200/80 text-stone-800"}`}
          >
            Single Day
          </button>
          <button
            type="button"
            onClick={() => setScope("range")}
            className={`rounded-md px-2 py-1 font-medium ${scope === "range" ? "bg-stone-900 text-white shadow-sm" : "bg-stone-200/80 text-stone-800"}`}
          >
            Range
          </button>
        </div>
        <input
          aria-label="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-3 w-full rounded-md border border-stone-300 bg-white p-2 text-sm text-stone-900 placeholder:text-stone-400"
          placeholder="Title"
        />
        <textarea
          aria-label="Note content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="mt-2 min-h-20 w-full rounded-md border border-stone-300 bg-white p-2 text-sm text-stone-900 placeholder:text-stone-400"
          placeholder="Write details..."
        />
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={submit}
            className="rounded-md bg-[var(--theme-primary)] px-3 py-2 text-xs font-medium text-white"
          >
            {editingId ? "Update note" : "Save note"}
          </button>
          {editingId ? (
            <button type="button" onClick={resetForm} className="rounded-md bg-stone-200 px-3 py-2 text-xs font-medium text-stone-800">
              Cancel
            </button>
          ) : null}
        </div>
      </div>

      <div className="relative min-h-52 overflow-hidden rounded-xl border border-amber-900/25 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#3f2e2212_2px,#3f2e2212_3px)] p-4 shadow-inner">
        <div className="pointer-events-none absolute inset-0 bg-amber-900/[0.06]" aria-hidden />
        <h3 className="relative mb-2 font-serif text-sm font-semibold text-stone-900">Cork board</h3>
        {notes.length === 0 ? (
          <p className="relative text-sm text-stone-700">No notes yet. Select days and tap save.</p>
        ) : null}
        {notes.map((note, idx) => (
          <motion.div
            key={note.id}
            drag
            dragMomentum={false}
            className="absolute w-[9.5rem] cursor-grab rounded-sm border border-black/10 p-3 shadow-[3px_6px_12px_rgba(0,0,0,0.25)] active:cursor-grabbing sm:w-40"
            style={{ backgroundColor: note.color, left: 12 + (idx % 2) * 160, top: 44 + Math.floor(idx / 2) * 92 }}
          >
            <p className="text-xs font-semibold">{note.title}</p>
            <p className="mt-1 line-clamp-2 text-xs">{note.content || "No content"}</p>
            <p className="mt-1 text-[10px] text-zinc-700">
              {note.scope === "single" ? note.date : `${note.rangeStart} - ${note.rangeEnd}`}
            </p>
            <div className="mt-2 flex gap-2 text-[10px]">
              <button type="button" onClick={() => startEdit(note)} className="rounded bg-white/70 px-2 py-1">
                Edit
              </button>
              <button type="button" onClick={() => onDelete(note.id)} className="rounded bg-white/70 px-2 py-1">
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
