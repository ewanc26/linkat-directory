// Inline theme loader - compiled from themeLoader.ts
// This runs immediately when the script loads
(function() {
  'use strict';
  
  // Theme configuration - single source of truth
  const THEMES = [
    { id: "default", name: "Green (Default)" }
  ];

  const THEME_STORAGE_KEYS = {
    MODE: "theme-mode",
    COLOR: "color-theme",
  };

  /**
   * Applies theme classes to the document element
   */
  function applyTheme(isDarkMode, themeId) {
    // Remove all existing theme classes
    document.documentElement.classList.remove("light");
    THEMES.forEach((theme) => {
      if (theme.id !== "default") {
        document.documentElement.classList.remove(theme.id);
      }
    });

    // Apply light mode class if needed
    if (!isDarkMode) {
      document.documentElement.classList.add("light");
    }

    // Apply color theme class if not default
    if (themeId !== "default") {
      document.documentElement.classList.add(themeId);
    }
  }

  /**
   * Gets the user's theme preferences from localStorage and system
   */
  function getThemePreferences() {
    const savedThemeMode = localStorage.getItem(THEME_STORAGE_KEYS.MODE);
    const savedColorTheme = localStorage.getItem(THEME_STORAGE_KEYS.COLOR);

    let isDarkMode;
    if (savedThemeMode) {
      isDarkMode = savedThemeMode === "dark";
    } else {
      // Use system preference as default
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      isDarkMode = prefersDark;
    }

    const themeId = savedColorTheme || "default";

    return { isDarkMode, themeId };
  }

  /**
   * Initializes theme system - runs immediately
   */
  function initializeTheme() {
    const { isDarkMode, themeId } = getThemePreferences();
    applyTheme(isDarkMode, themeId);
  }

  // Initialize theme immediately
  initializeTheme();
  
  // Make theme functions available globally for the Svelte component
  window.__themeLoader = {
    THEMES,
    THEME_STORAGE_KEYS,
    applyTheme,
    getThemePreferences,
    initializeTheme
  };
})();