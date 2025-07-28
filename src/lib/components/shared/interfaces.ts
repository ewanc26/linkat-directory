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
 * Represents the properties for the DynamicHead component.
 */
export interface DynamicHeadProps {
  title: string;
  description: string;
  keywords: string;
  ogUrl?: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  twitterCard?: string;
  twitterUrl?: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage?: string;
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
  DIRECTORY_OWNER: string; // Public user for ATProtocol.
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
 * Represents a user with basic details.
 */
export interface User {
  did: string;
  handle?: string;
  displayName?: string;
  avatar?: string;
  description?: string;
}