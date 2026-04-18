<p align="center">
  <h1 align="center">CardGen</h1>
  <p align="center">
    Open-source digital business card generator with a drag-and-drop designer.
    <br />
    <a href="https://owncardly.com"><strong>Live Demo</strong></a>
    ·
    <a href="https://github.com/kevinwielander/digital-business-cards/issues">Report Bug</a>
    ·
    <a href="https://github.com/kevinwielander/digital-business-cards/issues">Request Feature</a>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?logo=supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript" />
  <img src="https://img.shields.io/badge/license-MIT-green" />
</p>

---

## Features

- **Drag & Drop Designer** — Position text, images, shapes, icons, and QR codes on a visual canvas with snap-to-guide alignment
- **11 Starter Templates** — Portrait and landscape designs, ready to customize
- **Quick Create Flow** — Pick a template, fill in your info, download — no account needed
- **Company & Team Management** — Manage multiple companies with people, photos, and custom fields
- **CSV Bulk Import** — Import entire teams with auto column mapping
- **Asset Library** — Upload logos, backgrounds, and icons per company
- **Social Icons** — LinkedIn, X/Twitter, Instagram, GitHub, and more with clickable links
- **QR Code & vCard** — Auto-generated QR codes and one-click contact download
- **18 Google Fonts** — Full weight support (Light to Bold)
- **Layers Panel** — Reorder, group, lock, and hide elements like a proper design tool
- **Undo/Redo** — Ctrl+Z / Ctrl+Y with full history
- **10 Languages** — English, German, French, Spanish, Portuguese, Italian, Dutch, Japanese, Chinese, Korean
- **Guest Mode** — Try everything without signing up (data stored locally)
- **Mobile Responsive** — Cards scale automatically on mobile devices
- **Self-Contained Export** — Generated HTML files work offline with embedded images, fonts, and vCards
- **Google OAuth** — Sign in with Google, data persists in Supabase

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| Database | [Supabase](https://supabase.com) (PostgreSQL + Auth + Storage) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Language | TypeScript 5 |
| Drag & Drop | react-rnd |
| Animations | Framer Motion |
| QR Codes | qrcode |
| Image Cropping | react-easy-crop |
| CSV Parsing | PapaParse |
| ZIP Generation | JSZip |

## Quick Start

### Prerequisites

- Node.js 18+
- Yarn
- A free [Supabase](https://supabase.com) account

### Setup

1. **Clone the repo**
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
   Fill in your Supabase URL and anon key from the [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API.

4. **Set up database**
   ```bash
   npx supabase login
   npx supabase link --project-ref YOUR_PROJECT_REF
   npx supabase db push
   ```

5. **Configure auth** (optional, for Google sign-in)
   - Create OAuth credentials in [Google Cloud Console](https://console.cloud.google.com)
   - Add redirect URI: `https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback`
   - Enable Google provider in Supabase → Authentication → Providers

6. **Run the dev server**
   ```bash
   yarn dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

### Seed Sample Data (optional)

To populate with sample companies, people, and template assets:

```bash
npx tsx --env-file=.env.local scripts/seed-sample-assets.ts
```

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kevinwielander/digital-business-cards&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Docker

```bash
docker build -t cardgen .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your-url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
  cardgen
```

### Self-Hosting

See [Self-Hosting Guide](docs/self-hosting.md) for detailed instructions on deploying with Docker, Railway, or Render.

## Project Structure

```
app/
  api/          — API routes (card generation, image proxy)
  auth/         — Auth callback and guest data migration
  companies/    — Company management pages
  components/   — All React components
    designer/   — Card designer (canvas, layers, properties, icons)
  create/       — Quick card creation flow
  templates/    — Template management pages
lib/
  i18n/         — Translation strings (10 languages)
  supabase/     — Client helpers and constants
  types.ts      — TypeScript types
  fonts.ts      — Google Fonts config
  sample-templates.ts — Starter template definitions
supabase/
  migrations/   — Database migrations
```

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

[MIT](LICENSE) — free for personal and commercial use.

## Acknowledgments

- [Supabase](https://supabase.com) — Backend and auth
- [Vercel](https://vercel.com) — Hosting
- [Tailwind CSS](https://tailwindcss.com) — Styling
- [react-rnd](https://github.com/bokuweb/react-rnd) — Drag and resize
- [Framer Motion](https://www.framer.com/motion/) — Animations
