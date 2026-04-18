# Contributing to CardGen

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

### Prerequisites

- Node.js 18+
- Yarn
- A [Supabase](https://supabase.com) account (free tier works)

### Local Setup

1. **Fork and clone**
   ```bash
   git clone https://github.com/kevinwielander/digital-business-cards.git
   cd digital-business-cards
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase URL and anon key.

4. **Set up database**
   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   ```

5. **Run dev server**
   ```bash
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Making Changes

### Branch Naming

- `feat/description` — new features
- `fix/description` — bug fixes
- `docs/description` — documentation
- `refactor/description` — code improvements

### Commit Messages

Use clear, descriptive commit messages:
```
feat: add dark mode support
fix: resolve template preview scaling on mobile
docs: update self-hosting guide
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Ensure `yarn build` passes
4. Ensure `yarn lint` passes
5. Open a PR with a clear description of what changed and why
6. Wait for review

## Code Style

- **TypeScript** — strict mode, no `any` unless necessary
- **Tailwind CSS** — use utility classes, avoid custom CSS
- **Components** — client components use `"use client"`, server components are default
- **Translations** — all user-facing strings should use `useTranslation()` hook

## Project Structure

```
app/
  api/          — API routes (generate cards, proxy images)
  auth/         — Auth callback and migration
  companies/    — Company management pages
  components/   — All React components
    designer/   — Card designer components (canvas, layers, properties)
  create/       — Quick card creation flow
  login/        — Login page
  templates/    — Template management pages
lib/
  i18n/         — Translation strings
  supabase/     — Supabase client helpers + constants
  fonts.ts      — Google Fonts configuration
  types.ts      — TypeScript types
  sample-templates.ts — Starter template definitions
supabase/
  migrations/   — Database migrations
```

## Questions?

Open a [Discussion](https://github.com/kevinwielander/digital-business-cards/discussions) or file an issue.
