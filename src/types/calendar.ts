export type DateRange = {
  start: string | null;
  end: string | null;
};

export type NoteScope = "single" | "range";

export type CalendarNote = {
  id: string;
  title: string;
  content: string;
  scope: NoteScope;
  date: string | null;
  rangeStart: string | null;
  rangeEnd: string | null;
  color: string;
  position: { x: number; y: number };
};

export type Holiday = {
  date: string;
  name: string;
};
