# Contributing

Thank you for helping. Jazakumullahu khairan.

Issues and pull requests may be written in Bahasa Indonesia or English.

## Ways to help

- **Report a bug** or suggest an idea by [opening an issue](https://github.com/zikrulihsan/web-dzikr-app/issues/new/choose).
- **Correct the dzikir content**: a typo in the Arabic, a missing harakat, a
  better translation, a missing source.
- **Improve the app**: accessibility, performance, design, new features.

For a larger change, please open an issue first so we can agree on the
approach before you put time into it.

## Development

```bash
npm install
npm run dev
```

The app needs no environment variables. See the README for the optional
Supabase and analytics setup.

Before opening a pull request, make sure these pass (CI runs them too):

```bash
npm run lint
npm run typecheck
npm run build
```

Test on a phone-sized screen (around 390 px wide) in both light and dark
themes, and in focus mode: that is how most people use the app.

## Dzikir content

The texts live in [`src/data/dzikrData.ts`](src/data/dzikrData.ts). Because
people read and recite them, content changes are held to a higher bar:

- **Cite a source** for every change: a Qur'an reference (surah and ayah), or a
  hadith collection with its number. Put it in the `source` field and in the
  pull request description.
- Keep the Arabic exactly as in the source, with full harakat.
- Change one dzikr per pull request where you can, so each can be checked on
  its own.

## Code style

- TypeScript, React function components, Next.js App Router.
- Styles go in `src/styles/globals.css` using the existing CSS variables
  (`--text-primary`, `--primary-color`, ...) so both themes keep working.
- UI text is in Bahasa Indonesia.
- Match the surrounding code: naming, comment density and structure.

## Pull requests

- Branch from `main` and keep each pull request focused on one change.
- Describe what changed and why; add screenshots for visual changes.
- Link the issue it closes, if any.

By contributing you agree that your work is released under the [MIT License](LICENSE).
