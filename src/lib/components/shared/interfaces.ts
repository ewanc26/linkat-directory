/**
 * Represents a blog post with its content and metadata.
 */
export interface Post {
  postNumber?: number;
  title: string; // The title of the post.
  rkey: string; // A unique key for the post.
  createdAt: Date; // The date and time the post was created.
  content: string; // The content of the post, parsed to HTML.
  excerpt: string; // A plain text excerpt for meta descriptions.
  wordCount: number; // The word count for reading time calculation.
}

/**
 * Represents a blog post in its raw Markdown format.
 */
export interface MarkdownPost {
  title: string; // The title of the post.
  rkey: string; // A unique key for the post.
  createdAt: Date; // The date and time the post was created.
  mdcontent: string; // The raw Markdown content of the post.
}

// Define the type for the fetched links data
/**
 * Represents a single link card with a URL, text, and an emoji.
 */
export interface LinkCard {
  url: string; // The URL of the link.
  text: string; // The display text for the link.
  emoji: string; // An emoji associated with the link.
}

/**
 * Represents a board containing multiple link cards.
 */
export interface LinkBoard {
  $type: "blue.linkat.board"; // A type identifier for the link board.
  cards: LinkCard[]; // An array of LinkCard objects.
}

/**
 * Represents a theme with a unique identifier and a name.
 */
export interface Theme {
  id: string; // The unique identifier for the theme.
  name: string; // The name of the theme.
}

/**
 * Represents public environment variables.
 */
export interface PublicEnv {
  PUBLIC_ATPROTOCOL_USER: string; // Public user for ATProtocol.
  PUBLIC_ACTIVITYPUB_USER: string; // Public user for ActivityPub.
}

/**
 * Represents a user profile with various details.
 */
export interface Profile {
  avatar: string; // URL to the user's avatar image.
  banner: string; // URL to the user's banner image.
  displayName: string; // The display name of the user.
  did: string; // Decentralised Identifier of the user.
  handle: string; // The user's handle.
  description: string; // A description of the user.
  pds: string; // Personal Data Server URL.
}

/**
 * Represents a status update or a short message.
 */
export interface StatusUpdate {
  text: string; // The content of the status update.
  createdAt: Date; // The date and time the status update was created.
  tid: string; // A unique identifier for the status update.
}

/**
 * Properties for displaying recent content, possibly from a feed or similar source.
 */
export interface RecentFMProps {
    nomoji?: boolean; // Optional flag to disable emojis.
    displayName?: string; // Optional display name.
  }

/**
 * Represents the result of the BlogService, containing posts, profile, and utility functions.
 */
export interface BlogServiceResult {
  posts: Map<string, Post>;
  profile: Profile;
  sortedPosts: Post[];
  getPost: (rkey: string) => Post | null;
  getAdjacentPosts: (rkey: string) => { previous: Post | null; next: Post | null };
}