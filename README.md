# Dzikr App

A mobile-first web application for tracking daily dzikr with slide navigation similar to WhatsApp or Instagram stories.

## Features

- Mobile-first responsive design
- Swipeable interface for navigating between dzikr items
- Progress tracking for each dzikr
- Expandable descriptions
- Persistent storage of progress

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Zustand for state management
- React Swipeable for touch gestures

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- Swipe left/right or use the navigation buttons to move between dzikr items
- Tap the "Count" button to increment the counter for each dzikr
- Tap "Reset" to reset the counter for a specific dzikr
- Tap "Show more..." to expand the description

## Dzikr bersama (live)

The main screen shows how many people are reading right now, everyone's dzikr
count for today, and a ticker naming who else is here ("Ahmad sedang
berdzikr"). It runs on Supabase: Realtime Presence for who's online, and the
`scores` table (with Realtime) for today's totals. Without the env vars below
the app still works, just offline and on its own.

1. Create a Supabase project and enable **Authentication → Sign In / Providers →
   Anonymous sign-ins**.
2. Run `supabase/schema.sql` in the SQL editor (safe to re-run).
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in
   `.env.local` and in Netlify's environment variables (see `.env.local.example`).
