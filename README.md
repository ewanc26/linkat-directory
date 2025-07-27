# Website Template

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

This repository provides a versatile frontend template, primarily designed for [WhiteWind](https://whtwnd.com/), a Markdown blog service utilising [ATProto](https://atproto.com/). It is built upon a customised version of [WhiteBreeze](https://github.com/hugeblank/whitebreeze), specifically derived from commit [ff402f3](https://github.com/ewanc26/website/commit/ff402f3460d86c40ead13294ae1ff5d8605f741c) of [my website](https://github.com/ewanc26/website).

This template offers a pre-configured starting point with a robust structure, ready for customisation across various frontend projects, though its core focus remains WhiteWind compatibility.

## Installation

To commence using this template, ensure Node.js and npm are installed on your system.

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)
- Docker and Docker Compose (for Dockerised deployment)

### Environment Variables

Prior to running the application, configure the following environment variables within a `.env` file located in the project root:

```ini
PUBLIC_ATPROTOCOL_USER="myhandle.bsky.social" # Your handle, or DID
```
#### Note

You should also add your DID to the `.static/.well-known/atproto-did` file if you want to use your domain as your AT Protocol handle.

#### Optional Environment Variables

- `PUBLIC_LASTFM_USERNAME`: Required for the Now Playing (Last.fm) feature in `src/lib/components/profile/Status.svelte`.
- `PUBLIC_ACTIVITYPUB_USER=@user@server.tld`: Enables ActivityPub compatibility for improved content sharing and discoverability.

#### Embed Images

While the `./static/embed/` directory is currently empty, it is intended for social media embed images. By default, the system will look for `blog.png` or `main.png` within this directory. For optimal display, these images should have dimensions of 630x1200 pixels.

## Usage

### Development

To run the project in development mode:

```sh
npm install
npm run dev
```

### Production

For optimal production deployment, the following record types are required in your [AT Protocol repository](https://atproto.com/specs/repository):

#### Required Records

- `app.bsky.actor.profile`: Your profile.
- `com.whtwnd.blog.entry`: Your blog posts.
- `blue.linkat.board`: Your links.

### Deployment

#### Standalone

To build and run the project as a standalone application:

```sh
npm install
npm run build
node index.js
```

Environment variables can be set before the last command, and the port can be configured with the `PORT` variable.

#### Dockerised

To deploy using Docker:

1. Modify `compose.yaml` to change the host port if necessary.
2. Run the following command:

```sh
docker compose up -d
```

## Licensing

This project is a template based on WhiteBreeze. For comprehensive licensing details, please consult the `LICENSE` file within this repository.