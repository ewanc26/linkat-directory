# Linkat Directory

[![No Maintenance Intended](http://unmaintained.tech/badge.svg)](http://unmaintained.tech/)

<img src="./static/logo.png" alt="Linkat Directory" width="100"/>

## Project Purpose

Linkat Directory is a SvelteKit application designed to serve as an alternate frontend to Linkat, providing a curated directory of links, primarily focusing on Bluesky profiles and content. It allows for the display of user profiles, including their Decentralised Identifiers (DIDs), handles, display names, avatars, and descriptions. The application is built with a focus on responsiveness and ease of use, providing a clean interface for discovering links.

## Installation

To set up the Linkat Directory locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone git@github.com:ewanc26/linkat-directory.git
    cd linkat-directory
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env` file in the project root based on `.env.example`. At a minimum, you should define `DIRECTORY_OWNER` or `PUBLIC_LINKAT_USERS`.
    
    Example for a single directory owner:
    ```
    DIRECTORY_OWNER=did:plc:your-did-here
    ```
    
    Example for multiple users:
    ```
    PUBLIC_LINKAT_USERS=did:plc:user1,did:web:user2
    ```

    Example for hiding the directory owner's card:
    ```
    HIDE_OWNER_CARD=true
    ```

    Example for displaying the user banner (default: false):
    ```
    DISPLAY_USER_BANNER=true
    ```

    Example for controlling the display of the user description:
    ```
    DISPLAY_USER_DESCRIPTION=true
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be accessible at `http://localhost:5173`.

## Usage

Once the application is running, you can:

-   Browse the main directory page to see configured users.
-   View individual user profiles by navigating to `/user/[did]`, where `[did]` is the user's Decentralised Identifier.
-   The application dynamically generates Open Graph and Twitter metadata for improved social sharing.

## Project Structure

Key directories and files:

-   `src/routes/`: Contains SvelteKit routes, including the main page (`+page.svelte`) and user profile pages (`user/[did]/+page.svelte`).
-   `src/lib/components/`: Reusable Svelte components, such as `DynamicHead.svelte` for managing dynamic `<head>` content, and profile-related components.
-   `src/lib/css/`: Global CSS styles, including `app.css` (for general styling) and `variables.css` (for CSS variables).
-   `src/lib/utils/`: Utility functions, such as caching mechanisms.
-   `src/lib/profile/profile.ts`: Logic for fetching and processing user profile data from Bluesky.
-   `svelte.config.js`: SvelteKit configuration, including prerendering settings. Note that the `origin` property in `prerender` has been removed for Vercel deployments to simplify the setup.

## Contributing

Contributions are welcome! Please ensure your code adheres to the project's coding standards, including British English for comments and documentation, and responsive design principles.

## Credits

This project utilises data and concepts from:

-   [linkat.blue](https://linkat.blue) by [mkizka.dev](https://bsky.app/profile/did:plc:4gow62pk3vqpuwiwaslcwisa)
-   [atproto.com](https://atproto.com) by [Bluesky](https://bsky.social)

## License

This project is licensed under the [GNU Affero General Public License Version 3](LICENSE).