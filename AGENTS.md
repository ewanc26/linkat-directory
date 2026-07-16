# AGENTS.md

Guidance for Linkat Directory, an unmaintained SvelteKit 2/Svelte 5 frontend that prerenders a configured set of Bluesky profiles and their `blue.linkat.board` records for Vercel.

## Map and data flow

- `src/routes/+layout.ts` reads the configured DIDs, resolves each through Slingshot, and reads board records directly from that user's PDS. It also supplies the primary profile and display flags to the home page.
- `src/routes/+page.svelte` renders the shuffled directory; `src/routes/user/[did]/` fetches a selected profile and board. These loads can run during prerender and again in the browser, so keep both environments working.
- `src/lib/components/profile/profile.ts` fetches the primary Bluesky profile and resolves its PDS. `src/lib/utils/cache.ts` is a browser-only, one-hour `localStorage` cache; it does nothing during SSR.
- `src/lib/components/archive/` owns profile cards, while `src/lib/components/layout/main/` renders Linkat cards. Shared record shapes are in `src/lib/components/shared/interfaces.ts`.
- `svelte.config.js` uses the Vercel adapter, prerenders `*`, and deliberately sets `publicPrefix: ''`. Consequently every environment value used by the app is public; never put a secret in `.env`.

## Behavioural constraints

- `DIRECTORY_OWNER` is first in the directory and `PUBLIC_LINKAT_USERS` adds comma-separated `did:*` values. `HIDE_OWNER_CARD` only hides the owner's card; it does not stop the owner's profile or board fetches. The list currently declares `MAX_USERS` but does not enforce it.
- Treat Bluesky profiles, resolver responses, PDS URLs, and board records as untrusted remote input. Preserve URL encoding for identifiers, require successful responses before consuming JSON, validate board/card shapes and link schemes before rendering, and make individual-user failures non-fatal.
- DIDs are the route and repository identity. Handles and display names are mutable presentation data. A user's PDS must be resolved per DID rather than assuming `bsky.social`.
- Board retrieval currently calls `com.atproto.repo.listRecords` with `rkey=self`; do not mistake that query for a validated single-record lookup or silently broaden it without handling pagination and record selection.
- External card links open in a new tab with `noopener noreferrer`. Preserve keyboard-accessible buttons/links, visible error and empty states, responsive layouts, and safe rendering of remote text and image URLs.
- The module-level layout cache and browser cache can retain old profile/identity data. Changes to caching must account for DID changes, expiry, prerender isolation, and partial upstream outages.

## Working and validation

- The README's supported workflow is npm (`npm install`, `npm run dev`), and `package-lock.json` is present. A `pnpm-lock.yaml` is also tracked; do not regenerate or reconcile either lockfile during unrelated work, and update only the lockfile for the package manager intentionally used.
- Run `npm run check`, `npm run lint`, and `npm run build`; use `npm run preview` to inspect the prerendered result. There is no automated test suite.
- Manually cover no configuration, owner-only and multi-user configurations, hidden-owner/display flags, direct `/user/<did>` navigation, malformed or missing profiles/boards, resolver and PDS failures, unsafe/empty card URLs, keyboard navigation, and narrow screens.
- Never commit `.env`, `.svelte-kit/`, `build/`, deployment output, or fetched user data. Keep the repository's AGPL licensing and its explicitly unmaintained status intact unless the project owner changes them.
