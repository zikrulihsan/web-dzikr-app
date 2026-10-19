# Security policy

## Reporting a vulnerability

Please **do not** open a public issue for a security problem.

Report it privately through GitHub's
[private vulnerability reporting](https://github.com/zikrulihsan/web-dzikr-app/security/advisories/new).
Include what you found, how to reproduce it, and its possible impact.

You can expect a first reply within a week. Once a fix is out, we are happy to
credit you unless you prefer otherwise.

## Scope

The app is mostly client-side. The areas most worth a look are:

- The Supabase schema and row-level security policies in `supabase/schema.sql`
- Data written to the leaderboard and community presence
- Anything that could run script in another user's browser

The Supabase anon key is public by design; access is controlled by RLS.
