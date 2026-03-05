export type Locale = "en" | "fr" | "mg"

export const translations = {
  en: {
    nav: {
      dashboard: "Dashboard",
      tasks: "Tasks",
      finance: "Finance",
      health: "Health",
      notifications: "Notifications",
      settings: "Settings",
    },
    sections: {
      MAIN: "Main",
      SYSTEM: "System",
    },
    header: {
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      notifications: "Notifications",
    },
    pages: {
      "/protected/dashboard": "Dashboard",
      "/protected/tasks": "Tasks",
      "/protected/finance": "Finance",
      "/protected/health": "Health",
      "/protected/notifications": "Notifications",
      "/protected/settings": "Settings",
    },
    languages: {
      en: "English",
      fr: "Français",
      mg: "Malagasy",
    },
    theme: {
      light: "Light mode",
      dark: "Dark mode",
    },
  },
  fr: {
    nav: {
      dashboard: "Tableau de bord",
      tasks: "Tâches",
      finance: "Finance",
      health: "Santé",
      notifications: "Notifications",
      settings: "Paramètres",
    },
    sections: {
      MAIN: "Principal",
      SYSTEM: "Système",
    },
    header: {
      profile: "Profil",
      settings: "Paramètres",
      logout: "Déconnexion",
      notifications: "Notifications",
    },
    pages: {
      "/protected/dashboard": "Tableau de bord",
      "/protected/tasks": "Tâches",
      "/protected/finance": "Finance",
      "/protected/health": "Santé",
      "/protected/notifications": "Notifications",
      "/protected/settings": "Paramètres",
    },
    languages: {
      en: "Anglais",
      fr: "Français",
      mg: "Malgache",
    },
    theme: {
      light: "Mode clair",
      dark: "Mode sombre",
    },
  },
  mg: {
    nav: {
      dashboard: "Fandraisana",
      tasks: "Asa",
      finance: "Vola",
      health: "Fahasalamana",
      notifications: "Fampandrenesana",
      settings: "Fikirana",
    },
    sections: {
      MAIN: "Lehibe",
      SYSTEM: "Rafitra",
    },
    header: {
      profile: "Mombamomba",
      settings: "Fikirana",
      logout: "Hivoaka",
      notifications: "Fampandrenesana",
    },
    pages: {
      "/protected/dashboard": "Fandraisana",
      "/protected/tasks": "Asa",
      "/protected/finance": "Vola",
      "/protected/health": "Fahasalamana",
      "/protected/notifications": "Fampandrenesana",
      "/protected/settings": "Fikirana",
    },
    languages: {
      en: "Anglisy",
      fr: "Frantsay",
      mg: "Malagasy",
    },
    theme: {
      light: "Mazava",
      dark: "Maizina",
    },
  },
} satisfies Record<Locale, typeof translations["en"]>

export type TranslationKeys = typeof translations["en"]
