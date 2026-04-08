import type { Holiday } from "@/types/calendar";

/**
 * Mock holidays for demo (mix of India + widely recognized dates).
 * Swap with an API (e.g. Nager.Date, Calendarific) when you need live data.
 */
export const MOCK_HOLIDAYS: Holiday[] = [
  { date: "2026-01-01", name: "New Year's Day" },
  { date: "2026-01-26", name: "Republic Day (India)" },
  { date: "2026-02-14", name: "Valentine's Day" },
  { date: "2026-03-08", name: "Holi (mock date)" },
  { date: "2026-03-25", name: "Good Friday (mock)" },
  { date: "2026-04-14", name: "Ambedkar Jayanti (India)" },
  { date: "2026-05-01", name: "Labour Day / May Day" },
  { date: "2026-06-21", name: "International Yoga Day" },
  { date: "2026-08-15", name: "Independence Day (India)" },
  { date: "2026-09-05", name: "Teachers' Day (India)" },
  { date: "2026-10-02", name: "Gandhi Jayanti" },
  { date: "2026-10-31", name: "Halloween" },
  { date: "2026-11-12", name: "Diwali (mock date)" },
  { date: "2026-12-25", name: "Christmas Day" },
];
