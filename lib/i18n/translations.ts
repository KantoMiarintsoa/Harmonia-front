export type Locale = "en" | "fr" | "mg"

type TranslationShape = {
  nav: { dashboard: string; tasks: string; finance: string; health: string; notifications: string; ai: string; settings: string }
  sections: { MAIN: string; SYSTEM: string }
  header: { profile: string; settings: string; logout: string; notifications: string }
  pages: Record<string, string>
  languages: { en: string; fr: string; mg: string }
  theme: { light: string; dark: string }
  auth: {
    brand: string
    login: {
      welcome: string; subtitle: string; forgotPassword: string
      submit: string; submitting: string; noAccount: string; signUp: string
      googleLogin: string; appleLogin: string
      errFill: string; errNoAccount: string; errWrongPwd: string
    }
    register: {
      title: string; subtitle: string; name: string; confirm: string
      submit: string; submitting: string; hasAccount: string; signIn: string
      googleRegister: string; errFill: string; errShortPwd: string
      errMismatch: string; errExists: string
    }
  }
  common: {
    save: string; cancel: string; delete: string; edit: string; add: string
    irreversible: string; saveSuccess: string; saveError: string; seeAll: string
  }
}

export const translations: Record<Locale, TranslationShape> = {
  en: {
    nav: { dashboard: "Dashboard", tasks: "Tasks", finance: "Finance", health: "Health", notifications: "Notifications", ai: "AI", settings: "Settings" },
    sections: { MAIN: "Main", SYSTEM: "System" },
    header: { profile: "Profile", settings: "Settings", logout: "Logout", notifications: "Notifications" },
    pages: {
      "/protected/dashboard": "Dashboard",
      "/protected/tasks": "Tasks",
      "/protected/finance": "Finance",
      "/protected/health": "Health",
      "/protected/notifications": "Notifications",
      "/protected/ai": "AI & Predictions",
      "/protected/settings": "Settings",
    },
    languages: { en: "English", fr: "Français", mg: "Malagasy" },
    theme: { light: "Light mode", dark: "Dark mode" },
    auth: {
      brand: "HARMONIA",
      login: {
        welcome: "Welcome back", subtitle: "Please enter your login credentials",
        forgotPassword: "Forgot password?", submit: "Login", submitting: "Signing in…",
        noAccount: "Don't have an account?", signUp: "Sign up",
        googleLogin: "Sign in with Google", appleLogin: "Sign in with Apple ID",
        errFill: "Please fill in all fields.",
        errNoAccount: "No account found with this email. Please sign up first.",
        errWrongPwd: "Incorrect password. Please try again.",
      },
      register: {
        title: "Create Account", subtitle: "Please fill in the information below",
        name: "Full Name", confirm: "Confirm Password",
        submit: "Sign Up", submitting: "Creating account…",
        hasAccount: "Already have an account?", signIn: "Sign in",
        googleRegister: "Sign up with Google",
        errFill: "Please fill in all fields.",
        errShortPwd: "Password must be at least 6 characters.",
        errMismatch: "Passwords do not match.",
        errExists: "An account with this email already exists. Please sign in.",
      },
    },
    common: {
      save: "Save", cancel: "Cancel", delete: "Delete", edit: "Edit", add: "Add",
      irreversible: "This action is irreversible.",
      saveSuccess: "Saved successfully", saveError: "An error occurred", seeAll: "See all",
    },
  },

  fr: {
    nav: { dashboard: "Tableau de bord", tasks: "Tâches", finance: "Finance", health: "Santé", notifications: "Notifications", ai: "IA", settings: "Paramètres" },
    sections: { MAIN: "Principal", SYSTEM: "Système" },
    header: { profile: "Profil", settings: "Paramètres", logout: "Déconnexion", notifications: "Notifications" },
    pages: {
      "/protected/dashboard": "Tableau de bord",
      "/protected/tasks": "Tâches",
      "/protected/finance": "Finance",
      "/protected/health": "Santé",
      "/protected/notifications": "Notifications",
      "/protected/ai": "IA & Prédictions",
      "/protected/settings": "Paramètres",
    },
    languages: { en: "Anglais", fr: "Français", mg: "Malgache" },
    theme: { light: "Mode clair", dark: "Mode sombre" },
    auth: {
      brand: "HARMONIA",
      login: {
        welcome: "Bon retour", subtitle: "Veuillez entrer vos identifiants",
        forgotPassword: "Mot de passe oublié ?", submit: "Se connecter", submitting: "Connexion…",
        noAccount: "Pas encore de compte ?", signUp: "S'inscrire",
        googleLogin: "Continuer avec Google", appleLogin: "Continuer avec Apple",
        errFill: "Veuillez remplir tous les champs.",
        errNoAccount: "Aucun compte trouvé avec cet e-mail. Veuillez d'abord vous inscrire.",
        errWrongPwd: "Mot de passe incorrect. Veuillez réessayer.",
      },
      register: {
        title: "Créer un compte", subtitle: "Remplissez les informations ci-dessous",
        name: "Nom complet", confirm: "Confirmer le mot de passe",
        submit: "S'inscrire", submitting: "Création du compte…",
        hasAccount: "Déjà un compte ?", signIn: "Se connecter",
        googleRegister: "S'inscrire avec Google",
        errFill: "Veuillez remplir tous les champs.",
        errShortPwd: "Le mot de passe doit contenir au moins 6 caractères.",
        errMismatch: "Les mots de passe ne correspondent pas.",
        errExists: "Un compte avec cet e-mail existe déjà. Veuillez vous connecter.",
      },
    },
    common: {
      save: "Enregistrer", cancel: "Annuler", delete: "Supprimer", edit: "Modifier", add: "Ajouter",
      irreversible: "Cette action est irréversible.",
      saveSuccess: "Enregistré avec succès", saveError: "Une erreur est survenue", seeAll: "Voir tout",
    },
  },

  mg: {
    nav: { dashboard: "Fandraisana", tasks: "Asa", finance: "Vola", health: "Fahasalamana", notifications: "Fampandrenesana", ai: "IA", settings: "Fikirana" },
    sections: { MAIN: "Lehibe", SYSTEM: "Rafitra" },
    header: { profile: "Mombamomba", settings: "Fikirana", logout: "Hivoaka", notifications: "Fampandrenesana" },
    pages: {
      "/protected/dashboard": "Fandraisana",
      "/protected/tasks": "Asa",
      "/protected/finance": "Vola",
      "/protected/health": "Fahasalamana",
      "/protected/notifications": "Fampandrenesana",
      "/protected/ai": "IA & Fitsapana",
      "/protected/settings": "Fikirana",
    },
    languages: { en: "Anglisy", fr: "Frantsay", mg: "Malagasy" },
    theme: { light: "Mazava", dark: "Maizina" },
    auth: {
      brand: "HARMONIA",
      login: {
        welcome: "Tonga soa indray", subtitle: "Ampidiro ny fampahalalana fidirana",
        forgotPassword: "Hadiniko ny teny miafina?", submit: "Miditra", submitting: "Fidirana…",
        noAccount: "Tsy manana kaonty?", signUp: "Misoratra anarana",
        googleLogin: "Miditra amin'ny Google", appleLogin: "Miditra amin'ny Apple",
        errFill: "Fenoy ny saha rehetra.",
        errNoAccount: "Tsy misy kaonty hita. Misoratra anarana aloha.",
        errWrongPwd: "Teny miafina diso. Andamo indray.",
      },
      register: {
        title: "Mamorona kaonty", subtitle: "Fenoy ny fampahalalana eto ambany",
        name: "Anarana feno", confirm: "Avereno ny teny miafina",
        submit: "Misoratra anarana", submitting: "Famoronana kaonty…",
        hasAccount: "Manana kaonty sahady?", signIn: "Miditra",
        googleRegister: "Misoratra anarana amin'ny Google",
        errFill: "Fenoy ny saha rehetra.",
        errShortPwd: "Teny miafina 6 tarehintsoratra farafahakeliny.",
        errMismatch: "Tsy mifanaraka ny teny miafina.",
        errExists: "Misy kaonty sahady amin'ity mailaka ity. Miditra azafady.",
      },
    },
    common: {
      save: "Tehirizo", cancel: "Foano", delete: "Fafao", edit: "Hanova", add: "Hanampy",
      irreversible: "Tsy azo averina ity fihetsika ity.",
      saveSuccess: "Voatahiry soa aman-tsara", saveError: "Nisy hadisoana", seeAll: "Jereo rehetra",
    },
  },
}

export type TranslationKeys = TranslationShape
