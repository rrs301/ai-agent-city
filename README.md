# Creator City

A reusable Next.js, React, and TypeScript boilerplate for a visual AI agent workspace: one permanent headquarters, customizable agent offices, and isometric roads.

![Creator City: start with headquarters, create an agent, grow a team](docs/assets/creator-city.svg)

## Start locally

Use Node.js 22 (`.nvmrc`) and npm. The minimum supported Node version is declared in `package.json`.

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). The homepage `/` shows the illustrations from `docs/assets`. The city needs no environment variables. `/sign-in`, `/sign-up` and `/dashboard` need the CloudHike and Strapi settings from [Authentication](docs/authentication.md). `.env.example` lists them without values.

## What is included

- A single permanent headquarters with Empire, Crown, and Twin designs.
- A reusable agent creation dialog with a live building preview.
- Customizable offices, roads, selection, dragging, zoom, and day/night mode.
- Typed public APIs, CSS modules, SVG renderer tests, and illustrated developer docs.
- Working lint, type-check, test, and production build commands.
- [AGENTS.md](AGENTS.md) and [CLAUDE.md](CLAUDE.md) for AI-assisted development.

This starter includes PostgreSQL/Drizzle scaffolding, Tailwind CSS, and Lucide icons alongside the city UI. Authentication (CloudHike.dev, with users saved to Strapi) is wired up. AI execution, city storage, and other server integrations are extension points.

## Use the starter

The homepage displays the documentation illustrations from `docs/assets` without a toolbar or inspector. Edit `app/page.tsx` to change the displayed images. The reusable city, roads, agent creation dialog, and all headquarters styles remain available through the public component API.

To build an interactive workspace, start with the [complete integration example](docs/integration.md).

## Reusable components

```tsx
import {
  AgentCity, AgentBuilding, HeadquartersBuilding, BuildingGlyph,
  AddAgentDialog, Road, RoadNetwork,
} from '@/components/agent-city';
```

The host owns agents, city configuration, selection, and persistence. Components supply rendering and interaction callbacks. [Copy the complete integration example](docs/integration.md) to start a new workspace.

## Documentation

| Guide | Contents |
| --- | --- |
| [Documentation home](docs/README.md) | Illustrated overview and source map |
| [Integration](docs/integration.md) | Complete city + creation/removal example |
| [Component API](docs/component-api.md) | Props, exported types, options, and defaults |
| [Headquarters](docs/headquarters.md) | Illustrated Empire, Crown, and Twin designs |
| [Architecture](docs/architecture.md) | State ownership, creation flow, coordinates, and invariants |
| [Customization](docs/customization.md) | Templates, palettes, roads, styles, and layout |
| [Authentication](docs/authentication.md) | Sign-in/sign-up, Google, sessions, Strapi users |
| [Extending the starter](docs/extending.md) | Persistence, AI execution, verification, and current limits |

## Project layout

```text
app/
  page.tsx                   Documentation illustration gallery
  globals.css                Tailwind CSS and original theme tokens
components/agent-city/       Reusable components, types, tests, and styles
db/                          Original PostgreSQL/Drizzle scaffold
drizzle.config.ts            Database configuration
postcss.config.mjs           Tailwind PostCSS configuration
docs/                        Illustrated component documentation
Isometric Campus.html        Original design reference
AGENTS.md                    Shared AI coding instructions
CLAUDE.md                    Entry point to shared instructions
eslint.config.mjs            ESLint configuration
```

The original database scaffold, Tailwind/PostCSS setup, and Lucide icons are included. The original design source is preserved in [Isometric Campus.html](Isometric%20Campus.html). Generated build files and local environment files are ignored by Git.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local development |
| `npm run lint` | Run ESLint with zero warnings allowed |
| `npm run typecheck` | Generate Next route types, then check TypeScript |
| `npm test` | Run road geometry and building renderer tests |
| `npm run build` | Original Next.js production build |
| `npm run build:webpack` | Verified webpack production build |
| `npm start` | Serve a completed production build |
| `npm run check` | Lint, type-check, test, and build |
| `npm run db:generate` / `npm run db:push` / `npm run db:studio` | Original database tooling |

`npm run check` uses the webpack fallback because Turbopack stalled in the development environment. Browser visuals, focus behavior, and pointer interactions still need browser QA; renderer tests use a DOM double. See [verification and limits](docs/extending.md).

## Build your app

Start in `app/page.tsx` for your app page and follow `docs/integration.md` to compose an interactive workspace. Reuse the library through `components/agent-city/index.ts`. Keep the one-headquarters rule in host state; `AgentCity` is a generic renderer.

Add persistence and job execution behind your own server boundary. A badge is display status; a road does not dispatch work. Keep agent definitions and saved layout separate so rearranging your city does not change execution behavior.
