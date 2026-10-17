-- Daily Dzikr — Supabase schema
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- Safe to re-run: every statement is idempotent, so running the whole file on
-- an existing project only adds what is missing.
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

-- Names are shown to everyone, so keep them short and non-blank.
alter table public.profiles drop constraint if exists profiles_display_name_length;
alter table public.profiles add constraint profiles_display_name_length
  check (char_length(btrim(display_name)) between 1 and 30);

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
drop policy if exists "scores are readable by anyone" on public.scores;
create policy "scores are readable by anyone"
  on public.scores for select
  using (true);

-- A user may write only their own score rows, and only for a day near today:
-- clients send their local date, which can sit a day either side of UTC.
drop policy if exists "users write their own scores" on public.scores;
create policy "users write their own scores"
  on public.scores for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and day between current_date - 1 and current_date + 1);

-- One full pagi + petang round is well under 1000 reps; cap it so a single
-- client can't inflate the shared "dzikir hari ini" counter.
alter table public.scores drop constraint if exists scores_total_range;
alter table public.scores add constraint scores_total_range
  check (total between 0 and 2000);

-- 3) Realtime ------------------------------------------------------------------
-- Let clients subscribe to leaderboard changes. (Presence uses a Realtime
-- channel and needs no table.)
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'scores'
  ) then
    alter publication supabase_realtime add table public.scores;
  end if;
end $$;

-- 4) Today's leaderboard (convenience view, UTC day) ----------------------------
-- The app reads leaderboard_for_day() below instead, keyed by the reader's
-- local date.
create or replace view public.leaderboard_today
  with (security_invoker = true) as
  select s.user_id,
         coalesce(p.display_name, 'Hamba Allah') as display_name,
         s.total
  from public.scores s
  join public.profiles p on p.id = s.user_id
  where s.day = current_date
  order by s.total desc;

-- 5) Daily stats and leaderboard by local day -----------------------------------
-- "Dzikir hari ini": every rep everyone has read on the given day, and how
-- many people read them.
create or replace function public.dzikr_day_stats(p_day date)
returns table (total bigint, people bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(sum(s.total), 0)::bigint as total,
         count(*) filter (where s.total > 0)::bigint as people
  from public.scores s
  where s.day = p_day;
$$;

create or replace function public.leaderboard_for_day(p_day date, p_limit int default 50)
returns table (user_id uuid, display_name text, total int)
language sql
stable
security invoker
set search_path = ''
as $$
  select s.user_id,
         coalesce(p.display_name, 'Hamba Allah') as display_name,
         s.total
  from public.scores s
  join public.profiles p on p.id = s.user_id
  where s.day = p_day and s.total > 0
  order by s.total desc, s.updated_at asc
  limit least(greatest(p_limit, 1), 100);
$$;

grant execute on function public.dzikr_day_stats(date) to anon, authenticated;
grant execute on function public.leaderboard_for_day(date, int) to anon, authenticated;
