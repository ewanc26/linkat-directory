# Linkat Directory

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

Alternate frontend for [Linkat](https://linkat.blue). Shows a directory of Bluesky profiles and their links.

> Also available on [Tangled](https://tangled.org/ewancroft.uk/linkat-directory)

## Setup

```bash
git clone git@github.com:ewanc26/linkat-directory.git
cd linkat-directory
npm install
```

Copy `.env.example` to `.env`. Set `DIRECTORY_OWNER` or `PUBLIC_LINKAT_USERS`:

```ini
DIRECTORY_OWNER=did:plc:your-did-here
```

Or for multiple users:

```ini
PUBLIC_LINKAT_USERS=did:plc:user1,did:web:user2
```

Other options:

```ini
HIDE_OWNER_CARD=true
DISPLAY_USER_BANNER=true
DISPLAY_USER_DESCRIPTION=true
```

### Run

```bash
npm run dev
```

Accessible at `http://localhost:5173`.

## Usage

- Browse the directory on the main page
- View a user's profile at `/user/[did]`

## Project layout

- `src/routes/` — SvelteKit routes (main page + user profiles)
- `src/lib/components/` — Reusable components (`DynamicHead.svelte`, profile components)
- `src/lib/css/` — Global styles and CSS variables
- `src/lib/utils/` — Caching utilities
- `src/lib/profile/profile.ts` — Fetches and processes profile data from Bluesky

## Licence

AGPLv3 — see [LICENCE](LICENCE)

## Credits

Uses data and concepts from [linkat.blue](https://linkat.blue) by mkizka and [atproto.com](https://atproto.com) by Bluesky.
