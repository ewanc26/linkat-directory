# AGENTS.md

Guidance for agents working on Linkat Directory, a SvelteKit directory for AT Protocol Linkat boards.

## Boundaries

- `src/routes/` owns directory pages and server endpoints.
- `src/lib/` owns handle/DID resolution, PDS record fetching, transformation, and reusable UI.
- `static/` contains public assets; `.github/` contains automation.

## Invariants

- Treat handles as mutable labels and DIDs as stable identities. Validate DID documents, PDS endpoints, NSIDs, cursors, and record content.
- External board data is untrusted: sanitize URLs/text, bound pagination and payloads, and handle partial failures visibly.
- Keep secrets and privileged fetch behavior server-side.
- Preserve stable directory URLs and useful cache semantics without serving stale identity mappings indefinitely.
- Match existing accessibility and responsive patterns.

## Validation

Run `npm run check`, `npm run lint`, and `npm run build`, then preview the production app. Exercise handle and DID lookup, missing/malformed board records, duplicate links, unsafe URLs, pagination, PDS timeout, empty state, direct routes, keyboard navigation, and mobile layout. Use npm and do not commit `.env` or build output.
