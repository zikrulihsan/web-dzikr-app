-- Daily Dzikr — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Identity is provided by Supabase Anonymous sign-ins, so every device gets a
-- real auth.uid() with no login UI. RLS uses that uid to keep people from
-- writing other people's rows.
--
-- This script is idempotent: it is safe to run again on an existing project.
-- (The SQL editor runs the whole script in one transaction, so a single
-- "already exists" error would roll back everything — hence the guards.)
--
-- Before this works you must also enable Authentication → Sign In / Providers →
-- Anonymous sign-ins in the dashboard. It is OFF by default, and without it
-- every write below is rejected and the leaderboard stays empty.

-- 1) Public profile per anonymous user -----------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Hamba Allah',
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone may read profiles (the leaderboard shows display names).
drop policy if exists "profiles are readable by anyone" on public.profiles;
create policy "profiles are readable by anyone"
  on public.profiles for select
  using (true);

-- A user may create / edit only their own profile.
drop policy if exists "users manage their own profile" on public.profiles;
create policy "users manage their own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Keep display names short and non-empty so one long name cannot wreck the
-- leaderboard layout for everybody else.
alter table public.profiles drop constraint if exists profiles_display_name_len;
alter table public.profiles add constraint profiles_display_name_len
  check (char_length(btrim(display_name)) between 1 and 24);

-- 2) Daily dzikr totals --------------------------------------------------------
create table if not exists public.scores (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  day        date not null default current_date,
  total      int  not null default 0,        -- sum of reps completed that day
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

alter table public.scores enable row level security;

-- RLS decides *whose* row you may write, not *what* you may put in it. Without
-- a ceiling anyone holding the public anon key could upsert total = 999999.
-- Raise this if src/data/dzikrData.ts ever grows past it (currently 341).
alter table public.scores drop constraint if exists scores_total_sane;
alter table public.scores add constraint scores_total_sane
  check (total >= 0 and total <= 2000);

-- Anyone may read scores (needed to render the leaderboard).
drop policy if exists "scores are readable by anyone" on public.scores;
create policy "scores are readable by anyone"
  on public.scores for select
  using (true);

-- A user may write only their own score rows.
drop policy if exists "users write their own scores" on public.scores;
create policy "users write their own scores"
  on public.scores for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- The leaderboard filters by day and sorts by total. The primary key is
-- (user_id, day), so its leading column is useless for that query.
create index if not exists scores_day_total_idx
  on public.scores (day, total desc);

-- 3) Realtime ------------------------------------------------------------------
-- Let clients subscribe to leaderboard changes. (Presence uses a Realtime
-- channel and needs no table.) Adding a table that is already published raises
-- an error, so only add it when it is missing.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'scores'
  ) then
    alter publication supabase_realtime add table public.scores;
  end if;
end
$$;

-- 4) Leaderboard view ----------------------------------------------------------
-- Keyed by day rather than pinned to current_date: the client sends its own
-- local day (see src/lib/day.ts), so a user in WIB reading dzikr at 01:00 still
-- lands on the right board instead of the server's UTC "yesterday".
-- security_invoker makes the view respect the caller's RLS instead of the
-- owner's — both tables are world-readable above, and this keeps Supabase's
-- Security Advisor quiet.
drop view if exists public.leaderboard_today;
drop view if exists public.leaderboard_daily;
create view public.leaderboard_daily
with (security_invoker = on) as
  select s.day,
         s.user_id,
         coalesce(p.display_name, 'Hamba Allah') as display_name,
         s.total
  from public.scores s
  join public.profiles p on p.id = s.user_id;

grant select on public.leaderboard_daily to anon, authenticated;
