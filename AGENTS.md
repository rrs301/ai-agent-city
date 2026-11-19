# Working on Creator City

## Start here

This is a Next.js App Router / React / TypeScript boilerplate for a visual AI agent workspace. Read `README.md`, then `docs/architecture.md` and the relevant component guide before changing behavior. There is no AI execution or city persistence. Authentication uses CloudHike.dev, and new users are saved to the Strapi Users collection. See `docs/authentication.md`.

Use npm and the committed `package-lock.json`. `.nvmrc` selects Node 22; the package engine requires Node >=20.9.0. Run `npm ci` for a fresh checkout. The city example needs no environment variables. Auth routes need the variables listed in `docs/authentication.md`. Preserve local `.env*` files and never print credentials.

## Project boundaries

- `app/page.tsx` shows the documentation illustration gallery from `docs/assets`.
- `app/(auth)/` holds `/sign-in` and `/sign-up`, `app/auth/callback` and `app/api/auth/session` finish Google sign-in, and `app/dashboard` is an intentionally empty, signed-in-only page. `lib/auth.ts` and `lib/strapi-users.ts` are server-only.
- `docs/integration.md` provides a complete interactive workspace example. When adding a workspace, its host owns data, creation/removal, and headquarters rules.
- `components/agent-city/index.ts` is the public component/type/helper API. Import it from application code.
- `components/agent-city/types.ts` defines serializable agents, buildings, and links.
- `agent-city.tsx` owns the camera and temporary pointer interaction; callers own saved data and selection.
- `add-agent-dialog.tsx` owns a draft and live preview. `onCreate` submits a validated draft; the host allocates IDs, commits it, and closes the dialog.
- `agent-building.tsx` handles client SVG drawing, isolated resource IDs, and cleanup.
- `headquarters-building.tsx` is the typed HQ-only preview. `headquarters-geometry.ts` supplies skyline bounds.
- `road.tsx` renders roads; `road-geometry.ts` builds pure world-space routes.
- `renderer.js` is the isolated legacy drawing factory, with a typed boundary in `renderer.d.ts`.
- `Isometric Campus.html` is the original design reference. It is not app runtime code; change reusable components for product behavior.

## Preserve these behaviors when composing a workspace

1. A workspace starts with exactly one headquarters and zero agents. Headquarters cannot be deleted in the example. Keep its `HEADQUARTERS_ID` stable when changing design so existing roads remain attached.
2. Creating an agent adds one agent record, one office on a free plot, and one road to headquarters. Cancel, Escape, or backdrop dismissal creates nothing.
3. Removing an office removes its related road links. If supporting multiple offices per agent, retain an agent still referenced by another office.
4. Reset city restores headquarters-only data. Reset view only restores the camera. Do not conflate the two actions.
5. Agent IDs, building IDs, and road IDs are separate domains. Link endpoints reference buildings; `agentId` connects an office to a worker.
6. Keep state updates immutable. The renderer redraws when the building object changes. Do not mutate exported presets.
7. A status badge is display data; a road is a visual connection. Neither dispatches AI work.

## Implementation conventions

- Keep reusable components independent from route files, storage, credentials, and job execution. Add real backend behavior on the server when requested.
- Use TypeScript at public boundaries and discriminated building unions. Prefer guarded updates over casting unrelated building types.
- Use CSS modules for component visuals and keep `app/globals.css` limited to the shared baseline. Keep the existing Tailwind CSS, Lucide icons, and PostgreSQL/Drizzle dependencies and scaffolding; do not remove them during UI cleanup.
- Components that use React state, events, or browser APIs need a client boundary. Do not access `document`, SVG DOM APIs, or native dialogs during server rendering.
- Building origins and road points are world coordinates. Only project them once. `RoadNetwork` applies its own isometric transform inside the camera group.
- Preserve instance-specific SVG IDs and effect cleanup so dialog previews, standalone buildings, and multiple cities can coexist.
- Preserve native modal focus containment, Escape/backdrop behavior, focus restoration, clear labels, visible focus styles, responsive layouts, and reduced-motion support.
- `AddAgentDialog.onCreate` is synchronous. If adding persistence, implement pending/error behavior and preserve the draft on failure before awaiting a request.
- When adding a palette/icon/architecture, update public options, the renderer, UI options, relevant preview bounds, docs, and meaningful renderer tests together.
- Automatic roads do not avoid obstacles. Dragging does not snap or prevent overlap. Do not claim those capabilities without implementing and verifying them.

## Checks

Run only what is relevant during development; run the complete check before handing off a boilerplate change:

```bash
npm run lint        # ESLint, no warnings allowed
npm run typecheck   # Generate Next route types, then TypeScript
npm test           # Road geometry and HQ/legacy renderer checks
npm run build:webpack # Verified production webpack build
npm run check      # All of the above
```

`npm run build` uses the original Next.js build command. `npm run build:webpack` is the verified fallback; the default Turbopack build stalled in the development environment. `npm run check` uses that fallback. Do not disable lint rules globally to hide a failure. The imported renderer is intentionally outside ESLint; test its drawing behavior instead.

SVG renderer tests use a DOM double. They check drawing output and resource references, not browser paint or pointer/focus behavior. For UI changes, verify in a browser when available and report any verification limits honestly. Do not invent screenshot or browser-test results.

## Documentation

Update the relevant guide when changing the public API or example behavior. `docs/component-api.md` describes props/defaults; `docs/integration.md` contains a complete client example; `docs/headquarters.md` covers HQ styles; `docs/extending.md` describes production extension points and current limits. Keep relative links valid. SVG illustrations live in `docs/assets/` and should have accessible titles/descriptions.

Do not add unrelated integrations, generated build output, credentials, or duplicate agent instruction sets. `CLAUDE.md` points to this file so instructions stay in one place.
