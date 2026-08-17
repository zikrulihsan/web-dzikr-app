# Dzikr App

A mobile-first web application for tracking daily dzikr with slide navigation similar to WhatsApp or Instagram stories.

## Features

- Mobile-first responsive design
- Swipeable interface for navigating between dzikr items
- Progress tracking for each dzikr, reset automatically each day
- Expandable descriptions
- Persistent local storage of progress — works fully offline
- **Live presence** — see how many people are reading dzikr right now
- **Daily leaderboard** — today's totals, shared across everyone

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Zustand for state management
- Swiper / React Swipeable for touch gestures
- Supabase (Postgres + Realtime + anonymous auth) for the live features

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

```bash
npm install
cp .env.example .env.local   # fill in the Supabase values, see below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The dzikr checklist works with no configuration at all. Presence, the community
page and the leaderboard stay switched off until Supabase is set up.

## Setting up the live features

All three steps are required. Skipping any one of them leaves the live features
silently disabled.

### 1. Environment variables

Copy `.env.example` to `.env.local` and fill in the two Supabase values from
**Dashboard → Project Settings → API**:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR-ANON-PUBLIC-KEY
```

> **Deploying:** `NEXT_PUBLIC_*` values are inlined into the JavaScript bundle at
> **build** time, not read at runtime. Adding them in the Netlify UI has no
> effect until you trigger a new deploy. This is the most common reason the live
> features look broken in production.

### 2. Database schema

Run [`supabase/schema.sql`](supabase/schema.sql) in **Dashboard → SQL Editor →
New query**. It creates the `profiles` and `scores` tables, their RLS policies,
the leaderboard view, and registers `scores` for Realtime. The script is
idempotent, so re-running it on an existing project is safe.

### 3. Anonymous sign-ins

Enable **Dashboard → Authentication → Sign In / Providers → Anonymous sign-ins**.
It is **off by default**.

Identity comes entirely from anonymous auth — there is no login screen. Every
device gets a real `auth.uid()`, which RLS uses to stop anyone from writing
someone else's rows. Without it, presence still works, but no score is ever
saved and the leaderboard stays empty.

### Checking it worked

Open the app and look at the browser console. Every failure path logs a
`[dzikr]` message naming the cause (missing session, rejected write, Realtime
channel error). No `[dzikr]` errors plus a live counter under the dzikr card
means everything is wired up.

## How the live features work

- **Presence** (`src/lib/presenceChannel.ts`) is a single module-level Realtime
  channel shared by every component and route, joined on the first subscriber and
  left a few seconds after the last one. Updates about what you are reading are
  debounced, since the counter would otherwise emit a message per tap.
- **Scores** (`src/lib/useScoreSync.ts`) mirror local progress to Supabase with a
  debounce. Local state stays the source of truth; the backend only holds the
  running daily total, so the checklist keeps working offline.
- **The day key** (`src/lib/day.ts`) is the user's *local* calendar date, shared
  by the store and the database rows. A UTC day would roll over at 07:00 WIB,
  right in the middle of dzikr pagi.

## Usage

- Swipe left/right or use the navigation buttons to move between dzikr items
- Tap the "Count" button to increment the counter for each dzikr
- Tap "Reset" to reset the counter for a specific dzikr
- Tap "Show more..." to expand the description
- Tap the presence pill to open the community page, and the trophy for the
  leaderboard, where you can also set the name you appear under
