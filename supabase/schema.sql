-- Daily Dzikr — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Identity is provided by Supabase Anonymous sign-ins, so every device gets a
-- real auth.uid() with no login UI. RLS uses that uid to keep people from
-- writing other people's rows.

-- 1) Public profile per anonymous user -----------------------------------------
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text not null default 'Hamba Allah',
  created_at   timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Anyone may read profiles (the leaderboard shows display names).
create policy "profiles are readable by anyone"
  on public.profiles for select
  using (true);

-- A user may create / edit only their own profile.
create policy "users manage their own profile"
  on public.profiles for all
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 2) Daily dzikr totals --------------------------------------------------------
create table if not exists public.scores (
  user_id    uuid not null references public.profiles (id) on delete cascade,
  day        date not null default current_date,
  total      int  not null default 0,        -- sum of reps completed that day
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

alter table public.scores enable row level security;

-- Anyone may read scores (needed to render the leaderboard).
create policy "scores are readable by anyone"
  on public.scores for select
  using (true);

-- A user may write only their own score rows.
create policy "users write their own scores"
  on public.scores for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 3) Realtime ------------------------------------------------------------------
-- Let clients subscribe to leaderboard changes. (Presence uses a Realtime
-- channel and needs no table.)
alter publication supabase_realtime add table public.scores;

-- 4) Today's leaderboard (convenience view) ------------------------------------
create or replace view public.leaderboard_today as
  select s.user_id,
         coalesce(p.display_name, 'Hamba Allah') as display_name,
         s.total
  from public.scores s
  join public.profiles p on p.id = s.user_id
  where s.day = current_date
  order by s.total desc;
