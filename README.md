# MyWebsite — Personal Portfolio

Personal portfolio website by MettiFire. This repository contains the source code for the site hosted at: https://annamettifogo.com

## Overview
This is a personal portfolio used to showcase projects, biography and contact information. The codebase is written primarily in TypeScript and uses React + Next.js. The site is deployed on Vercel.

## Languages (approximate composition) and roles
Based on the repository analysis, the codebase composition is approximately:
- TypeScript — ~68% — used for the application logic, components and types.
- JavaScript — ~28% — used for small scripts, interop and occasional utilities.
- CSS — ~4% — styling and Tailwind-related files.

These percentages are an estimate of lines/bytes per language and reflect where most of the code lives and what each language is mainly used for.

## Key technologies (conceptual)
- Next.js + React — framework and UI library for rendering and routing.
- TypeScript — type safety and developer ergonomics.
- Tailwind CSS (with PostCSS/autoprefixer) — utility-first approach to styling.
- Supabase — lightweight backend for things like counting views or small data storage.
- Small libraries — icons, theming helpers, and other focused utilities.

## Project structure (Next.js-style)
Typical layout for this repository (adjust if your repo uses different folders):

- /src/ or / — application source (components, pages/app, styles, etc.)
  - /components/ — reusable UI components
  - /app/ or /pages/ — Next.js app or pages directory (routing and pages)
  - /styles/ — Tailwind globals, CSS modules or global styles
  - /lib/ or /utils/ — helpers and utilities (e.g. supabase helpers)
  - /data/ — static site data (projects, metadata)
- /public/ — public assets (images, favicon)
- package.json — scripts and dependencies
- tsconfig.json — TypeScript config
- next.config.js — Next.js configuration (if present)
- README.md — this file
- LICENSE — license text

## How it's hosted
- Hosting: Vercel — automatic builds and global edge hosting on push.
- Domain: the site is served from https://annamettifogo.com (DNS configured to point to the Vercel deployment).
- Deployment flow: push → Vercel builds → site is deployed. Static optimization and edge caching are used where appropriate for fast delivery.

## How page views are counted (high-level, using Supabase)
Supabase is included in the project to provide a small backend for features like recording page views. A typical, secure approach to count views looks like this:

1. Data model
   - A simple "views" table with columns like: id, path (page or route), viewed_at (timestamp), optional metadata (referrer, user_agent, country, etc.).

2. Insertion flow (recommended)
   - Client-side code triggers a request when a page loads (or on a specific event) to an internal API route (Next.js API route or server action).
   - The API route runs on the server and uses server-side credentials (kept in environment variables) to insert a row into the Supabase "views" table.
   - Using a server-side route avoids exposing privileged keys on the client and allows applying rate-limiting and validation.

3. Alternative (client insert)
   - It's possible to insert directly from the client with the Supabase anon key if Row-Level Security (RLS) policies are configured to allow safe inserts only (e.g., only insert operations for authenticated/limited clients). This is simpler but requires careful security rules.

4. Example (conceptual Next.js API route)
```ts
// pages/api/track-view.ts (conceptual)
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export default async function handler(req, res) {
  const { path } = req.body
  await supabase.from('views').insert({ path, viewed_at: new Date() })
  res.status(200).json({ ok: true })
}
```
Notes:
- Use a service role key only on server-side code (never expose it to the browser).
- Consider storing minimal personal data and respect privacy. Optionally anonymize or avoid logging IPs.
- Add rate-limiting or deduplication to avoid inflated counts from bots.

5. Reporting and usage
   - Aggregation queries (counts per path, daily totals) can be run directly in Supabase SQL or via server endpoints to power admin pages or analytics endpoints.

## How it's built (concept)
- Component-based UI: small reusable React components.
- File-based routing: pages map to URLs, making it simple to add content.
- Static-first: prioritize pre-rendered content for speed, enabling simple dynamic features via API routes or client requests when needed.
- TypeScript for robustness and clearer intent in code.

## Linting and formatting
- ESLint is included to keep the codebase consistent. Add Prettier or other tools if you want automatic formatting.

## License
This project uses the MIT License. See the LICENSE file for details.

## Author
- MettiFire — https://github.com/MettiFire
- Site: https://annamettifogo.com