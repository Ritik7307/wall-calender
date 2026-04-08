## Interactive Wall Calendar

A polished, production-ready calendar UI built with Next.js App Router, Tailwind CSS, Framer Motion, and Zustand.

## Features

- Wall-style calendar with hero image and responsive layout
- Drag-to-select date range with clear range highlighting
- Notes for single date and date ranges (editable + deletable)
- Draggable sticky-note cards
- Event indicators (dots) and holiday highlighting
- Keyboard navigation with arrow keys
- Local persistence through `localStorage`
- Month change page-flip animation

## Project Structure

- `src/components/calendar/CalendarWall.tsx`
- `src/components/calendar/CalendarGrid.tsx`
- `src/components/calendar/DayCell.tsx`
- `src/components/calendar/DateRangePicker.tsx`
- `src/components/calendar/NotesPanel.tsx`
- `src/hooks/useCalendar.ts`
- `src/store/calendarStore.ts`
- `src/data/holidays.ts`

## Run Locally

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push project to GitHub.
2. Open [Vercel](https://vercel.com/new).
3. Import the repository.
4. Keep defaults and click **Deploy**.

## Demo Video Suggestion

- Use Loom or OBS.
- Show desktop and mobile responsiveness.
- Demo drag range selection, page flip, notes CRUD, and keyboard arrows.
- Keep it around 60-90 seconds for a concise showcase.
