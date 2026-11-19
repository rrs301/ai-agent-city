# Extend and maintain the boilerplate

[Documentation home](README.md) · [Architecture](architecture.md)

## What is implemented today

The example has one permanent headquarters, local agent creation with a live preview, office editing/removal, roads, selection, dragging, camera controls, and night mode. State lives in the host page's React state. Reloading resets the workspace. No agent actually executes a task.

## Add persistence

Keep workspace layout and agent definitions separate. A useful future model is:

| Record | Fields to consider |
| --- | --- |
| Workspace | ID, owner, name, schema version |
| Agent | ID, workspace ID, name, task, execution configuration |
| Building | ID, workspace ID, agent ID, type, position, appearance |
| Link | ID, workspace ID, endpoint building IDs, route/style |
| Job | ID, agent ID, input, status, output, timestamps |

The original PostgreSQL/Drizzle scaffold is in `db/` with users/posts tables and `drizzle.config.ts`. It is not connected to the city. Add your city schema and persistence API when needed.

Validate imported records at your API boundary: unique IDs, finite coordinates, known enum values, roof items, and existing link endpoints. Preserve exactly one headquarters per workspace. Version saved configuration before introducing incompatible shape changes.

For creation, save the agent, office, and road as one transaction or one consistent server operation, then update the UI from the result. For deletion, remove related links and handle shared agent references. The generic renderer cannot enforce these persistence rules.

## Connect actual agent execution

Run model calls and task dispatch in server-side services or jobs. Store credentials on the server. Keep runtime job status separate from layout changes, then map that status into the `agents` prop to update badges.

A visual road does not schedule work or define a dependency graph. If you need agent-to-agent handoffs, model those connections separately using agent IDs and execution semantics. Keep the visual map free to rearrange without changing task behavior accidentally.

## Add asynchronous creation

The current dialog's `onCreate` callback is synchronous and has no pending/error state. Extend it with a pending flag, duplicate-submit prevention, and an inline error before awaiting network requests. Close only after success; preserve the user's draft on failure. The existing `initialValue` supports templates, not an external controlled draft.

## Accessibility and browser QA

The modal uses native `showModal()` for top-layer presentation and focus containment. It focuses the name field and restores the opening trigger on close. Building selection supports Enter and Space when an `onSelect` handler is provided. Movement currently requires a pointer; there are no keyboard move controls.

Before shipping, check in your supported browsers:

- Open from each Add agent button; Tab and Shift+Tab remain inside the dialog.
- Cancel, Escape, close button, and backdrop restore focus without creating records.
- Blank or whitespace-only names/tasks cannot create an agent.
- Appearance changes update the preview, including all floors and glass modes.
- Create adds one office and road; remove leaves headquarters; reset returns to one HQ.
- Drag, pan, zoom, selection, narrow layouts, night mode, and reduced motion behave as expected.
- Multiple city/preview instances have no SVG gradient/filter ID collisions.

Browser visuals and interactions have not yet been verified in this workspace. Automated checks do not substitute for these browser checks.

## Automated checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
# Or run all checks:
npm run check
```

Headquarters tests cover architecture/height/tint/spire combinations, palettes, isolated resource IDs, preview height bounds, and legacy building rendering using an SVG DOM double. The routing tests cover both elbow directions, moved endpoints, explicit/direct waypoints, duplicate points, zero-length paths, and non-finite coordinates. They do not exercise React events or browser SVG rendering.

`npm run build` uses the original Next.js command. `npm run build:webpack` is the verified fallback used by `npm run check`; the default Turbopack build stalled in the development environment. `npm start` serves a successful build. `npm run lint` uses the flat configuration in `eslint.config.mjs` and fails on warnings; the imported drawing factory and original HTML are excluded from lint. Renderer tests cover the factory separately. `npm run typecheck` generates Next route types first, so it also works in a clean checkout.

## Current layout limits

- `nextOfficePosition` uses center spacing, not true footprint collision detection.
- Dragging can overlap offices and does not snap to plots.
- Roads may cross other plots; automatic obstacle avoidance is not implemented.
- Camera and ground grid have initial fixed bounds. Large cities need fit-to-content controls or expanded navigation.
- Reset view restores the initial camera; it does not recover a moved headquarters automatically.
- The renderer is legacy JavaScript behind a typed declaration. New geometry needs runtime/browser verification as well as type checks.
- There are no persistence, billing, job processing, or deployment features wired into the city. App-level sign-in is described in [authentication.md](authentication.md).

## Documentation assets

`docs/assets/creator-city.svg` illustrates the headquarters and offices using the project's actual drawing primitives. `docs/assets/agent-creation-flow.svg` explains state ownership. Both are vector assets with embedded accessible descriptions and no external fonts or network dependencies. Update the illustrations when changing architecture or major visual concepts; do not present them as live screenshots.
