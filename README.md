# Tap Tap Dzikr

> Ganti kebiasaan tap tap medsos dengan tap tap dzikr.

A mobile-first web app for reading the daily morning and evening dzikir
(*dzikir pagi & petang*). Instead of scrolling, you tap: the right side of the
card marks a dzikr as read and moves on, the left side goes back.

**Live:** https://dzikir-harian.netlify.app

> **Bahasa Indonesia:** Tap Tap Dzikr adalah aplikasi web untuk membaca dzikir
> pagi dan petang. Tap sisi kanan kartu untuk lanjut, sisi kiri untuk kembali.
> Waktu shalat dihitung langsung di perangkat, tanpa server. Kontribusi sangat
> diterima, lihat [CONTRIBUTING.md](CONTRIBUTING.md).

## Features

- **Pagi or petang, automatically.** Morning dzikir runs from Subuh until
  Ashar, evening dzikir from Ashar until the next Subuh, based on prayer times
  for where you are. You can also pick one manually.
- **Tap to read.** Tap right to go on, left to go back, or swipe. Two counting
  modes: count on your fingers and tap once when done (the default, following
  the Sunnah), or a tap counter.
- **Focus mode.** A full-screen reading view with nothing but the card.
- **Prayer times on the device.** Computed locally with the Kemenag RI
  convention (Subuh 20°, Isya 18°, Ashar Syafi'i, 2 minutes ihtiyat). Uses your
  location if you allow it, otherwise a city in your device's time zone.
- **Readable.** Arabic in Amiri, optional Latin transliteration and Indonesian
  translation, adjustable font sizes, light and dark themes.
- **Works offline.** Progress is saved on the device. A Supabase backend is
  optional and only adds a daily leaderboard and live community presence.

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router) with TypeScript
- [Zustand](https://github.com/pmndrs/zustand) for state, persisted to `localStorage`
- [Swiper](https://swiperjs.com/) for card navigation
- Plain CSS (`src/styles/globals.css`) with CSS variables for theming; Tailwind is set up but barely used
- [Supabase](https://supabase.com/) (optional): anonymous auth, Postgres with RLS, Realtime

## Getting started

Requires Node.js 18.17 or newer.

```bash
git clone https://github.com/zikrulihsan/web-dzikr-app.git
cd web-dzikr-app
npm install
npm run dev
```

Open http://localhost:3000. No configuration is needed: without environment
variables the app runs fully on the device.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |

### Environment variables (optional)

Copy `.env.example` to `.env.local` and fill in what you need.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Enables the leaderboard and community presence |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics, loaded only when set |
| `NEXT_PUBLIC_UMAMI_WEBSITE_ID`, `NEXT_PUBLIC_UMAMI_SCRIPT_URL`, `NEXT_PUBLIC_UMAMI_DOMAINS` | Umami analytics, loaded only when the website ID is set |

### Supabase setup (optional)

1. Create a Supabase project.
2. Enable **Anonymous sign-ins** (Authentication → Providers).
3. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
4. Put the project URL and anon key in `.env.local`.

## Project structure

```
src/
  app/          Pages: / (reader), /leaderboard, /community
  components/   UI: DzikrCard, DzikrSlider, StartScreen, Onboarding, Settings, FocusMenu, ...
  data/         dzikrData.ts: the dzikir texts, translations and sources
  lib/          Prayer times, pagi/petang detection, focus mode, Supabase sync
  store/        Zustand store (progress and settings)
  styles/       Global CSS and theme variables
supabase/       Database schema
```

## Contributing

Contributions are welcome: bug fixes, accessibility, translations, and
corrections to the dzikir texts. Please read [CONTRIBUTING.md](CONTRIBUTING.md)
first. Changes to the dzikir content must cite a source.

By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md). To
report a security issue, see [SECURITY.md](SECURITY.md).

## License

[MIT](LICENSE) © zikrulihsan
