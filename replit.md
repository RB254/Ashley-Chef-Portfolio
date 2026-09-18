# Ashley Chef Portfolio

An image-led professional portfolio for Kenyan pastry and bakery professional Ashley Amani Wambura.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm --filter @workspace/ashley-chef-portfolio run dev` — run the public portfolio
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Public app: React + Vite + TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ashley-chef-portfolio/` — public single-page portfolio, gallery assets, CV download
- `artifacts/api-server/src/routes/portfolio.ts` — public portfolio and contact endpoints
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/portfolio.ts` — portfolio and contact persistence schema
- `lib/api-client-react/src/generated/` — generated React Query client

## Architecture decisions

- Portfolio content is served through the API and seeded into PostgreSQL on first API access, keeping the public page data-driven.
- Gallery binaries live in the frontend's public asset directory for this first build; gallery metadata is persisted in PostgreSQL and returned by the API.
- References are stored with `is_visible` so future admin controls can hide them without deleting verified records.
- The public page uses anchor navigation and a single visual narrative to help recruiters scan the profile quickly.

## Product

- Presents Ashley's professional identity, experience, skills, education, languages, interests, references, selected work, and contact details.
- Uses the supplied photography throughout a responsive gallery with a keyboard-accessible lightbox.
- Provides a CV download and persists employment/collaboration inquiries through the API.

## User preferences

- Keep the portfolio grounded in the supplied CV and avoid fabricated employment history, dish names, achievements, or image descriptions.

## Gotchas

- Run API codegen after changing `lib/api-spec/openapi.yaml` before using updated client or Zod exports.
- The generated API client uses DOM iterable types; `lib/api-client-react/tsconfig.json` includes `dom.iterable` for its generated fetch helper.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
