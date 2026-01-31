export type Locale = "en" | "de" | "es" | "pt" | "fr";

export const locales: Locale[] = ["en", "de", "es", "pt", "fr"];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  pt: "Português",
  fr: "Français",
};

// Dictionary type
export interface Dictionary {
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    sort: string;
    viewAll: string;
    learnMore: string;
  };
  nav: {
    home: string;
    courses: string;
    learningPaths: string;
    instructors: string;
    pricing: string;
    dashboard: string;
    signIn: string;
    signUp: string;
    signOut: string;
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    startFreeTrial: string;
    browseCourses: string;
    freeTrialDays: string;
    cancelAnytime: string;
  };
  courses: {
    title: string;
    subtitle: string;
    allDisciplines: string;
    mma: string;
    kickboxing: string;
    grappling: string;
    lessons: string;
    minutes: string;
    viewCourse: string;
    startLearning: string;
    continueLearning: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    monthly: string;
    annual: string;
    perMonth: string;
    perYear: string;
    save: string;
    mostPopular: string;
    startMonthly: string;
    getAnnual: string;
    features: {
      unlimitedAccess: string;
      newContentWeekly: string;
      hdVideo: string;
      coachFeedback: string;
      cancelAnytime: string;
      certificates: string;
    };
  };
  dashboard: {
    welcome: string;
    continueLearning: string;
    recentActivity: string;
    recommended: string;
    progress: string;
    completed: string;
    streak: string;
    watchTime: string;
  };
}

// English dictionary (default)
const en: Dictionary = {
  common: {
    loading: "Loading...",
    error: "An error occurred",
    success: "Success!",
    cancel: "Cancel",
    save: "Save",
    delete: "Delete",
    edit: "Edit",
    back: "Back",
    next: "Next",
    previous: "Previous",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    viewAll: "View All",
    learnMore: "Learn More",
  },
  nav: {
    home: "Home",
    courses: "Courses",
    learningPaths: "Learning Paths",
    instructors: "Instructors",
    pricing: "Pricing",
    dashboard: "Dashboard",
    signIn: "Sign In",
    signUp: "Sign Up",
    signOut: "Sign Out",
  },
  home: {
    heroTitle: "Master Martial Arts From Elite Coaches",
    heroSubtitle: "World-class instruction in MMA, Kickboxing, and Grappling. Train with champions from anywhere in the world.",
    startFreeTrial: "Start Free Trial",
    browseCourses: "Browse Courses",
    freeTrialDays: "7-day free trial",
    cancelAnytime: "Cancel anytime",
  },
  courses: {
    title: "Our Courses",
    subtitle: "Learn from the best martial artists in the world",
    allDisciplines: "All Disciplines",
    mma: "MMA",
    kickboxing: "Kickboxing",
    grappling: "Grappling",
    lessons: "lessons",
    minutes: "min",
    viewCourse: "View Course",
    startLearning: "Start Learning",
    continueLearning: "Continue Learning",
  },
  pricing: {
    title: "Train Like a Champion",
    subtitle: "Get unlimited access to world-class martial arts instruction",
    monthly: "Monthly",
    annual: "Annual",
    perMonth: "/month",
    perYear: "/year",
    save: "Save",
    mostPopular: "Most Popular",
    startMonthly: "Start Monthly",
    getAnnual: "Get Annual",
    features: {
      unlimitedAccess: "Unlimited access to all courses",
      newContentWeekly: "New content added weekly",
      hdVideo: "HD video quality",
      coachFeedback: "Training footage feedback",
      cancelAnytime: "Cancel anytime",
      certificates: "Course certificates",
    },
  },
  dashboard: {
    welcome: "Welcome back",
    continueLearning: "Continue Learning",
    recentActivity: "Recent Activity",
    recommended: "Recommended For You",
    progress: "Progress",
    completed: "Completed",
    streak: "Day Streak",
    watchTime: "Watch Time",
  },
};

// German dictionary
const de: Dictionary = {
  common: {
    loading: "Laden...",
    error: "Ein Fehler ist aufgetreten",
    success: "Erfolgreich!",
    cancel: "Abbrechen",
    save: "Speichern",
    delete: "Löschen",
    edit: "Bearbeiten",
    back: "Zurück",
    next: "Weiter",
    previous: "Zurück",
    search: "Suchen",
    filter: "Filtern",
    sort: "Sortieren",
    viewAll: "Alle anzeigen",
    learnMore: "Mehr erfahren",
  },
  nav: {
    home: "Startseite",
    courses: "Kurse",
    learningPaths: "Lernpfade",
    instructors: "Trainer",
    pricing: "Preise",
    dashboard: "Dashboard",
    signIn: "Anmelden",
    signUp: "Registrieren",
    signOut: "Abmelden",
  },
  home: {
    heroTitle: "Meistere Kampfkunst von Elite-Trainern",
    heroSubtitle: "Erstklassige Anleitung in MMA, Kickboxen und Grappling. Trainiere mit Champions aus aller Welt.",
    startFreeTrial: "Kostenlos testen",
    browseCourses: "Kurse durchsuchen",
    freeTrialDays: "7 Tage kostenlos",
    cancelAnytime: "Jederzeit kündbar",
  },
  courses: {
    title: "Unsere Kurse",
    subtitle: "Lerne von den besten Kampfsportlern der Welt",
    allDisciplines: "Alle Disziplinen",
    mma: "MMA",
    kickboxing: "Kickboxen",
    grappling: "Grappling",
    lessons: "Lektionen",
    minutes: "Min",
    viewCourse: "Kurs ansehen",
    startLearning: "Jetzt starten",
    continueLearning: "Weiterlernen",
  },
  pricing: {
    title: "Trainiere wie ein Champion",
    subtitle: "Unbegrenzter Zugang zu erstklassiger Kampfkunst-Anleitung",
    monthly: "Monatlich",
    annual: "Jährlich",
    perMonth: "/Monat",
    perYear: "/Jahr",
    save: "Spare",
    mostPopular: "Am beliebtesten",
    startMonthly: "Monatlich starten",
    getAnnual: "Jährlich abonnieren",
    features: {
      unlimitedAccess: "Unbegrenzter Zugang zu allen Kursen",
      newContentWeekly: "Wöchentlich neue Inhalte",
      hdVideo: "HD-Videoqualität",
      coachFeedback: "Feedback zum Trainingsvideo",
      cancelAnytime: "Jederzeit kündbar",
      certificates: "Kurszertifikate",
    },
  },
  dashboard: {
    welcome: "Willkommen zurück",
    continueLearning: "Weiterlernen",
    recentActivity: "Letzte Aktivität",
    recommended: "Für dich empfohlen",
    progress: "Fortschritt",
    completed: "Abgeschlossen",
    streak: "Tages-Streak",
    watchTime: "Lernzeit",
  },
};

// Spanish dictionary
const es: Dictionary = {
  common: {
    loading: "Cargando...",
    error: "Se produjo un error",
    success: "¡Éxito!",
    cancel: "Cancelar",
    save: "Guardar",
    delete: "Eliminar",
    edit: "Editar",
    back: "Atrás",
    next: "Siguiente",
    previous: "Anterior",
    search: "Buscar",
    filter: "Filtrar",
    sort: "Ordenar",
    viewAll: "Ver todo",
    learnMore: "Saber más",
  },
  nav: {
    home: "Inicio",
    courses: "Cursos",
    learningPaths: "Rutas de Aprendizaje",
    instructors: "Instructores",
    pricing: "Precios",
    dashboard: "Panel",
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    signOut: "Cerrar sesión",
  },
  home: {
    heroTitle: "Domina las Artes Marciales con Entrenadores de Élite",
    heroSubtitle: "Instrucción de clase mundial en MMA, Kickboxing y Grappling. Entrena con campeones desde cualquier lugar.",
    startFreeTrial: "Prueba Gratis",
    browseCourses: "Ver Cursos",
    freeTrialDays: "7 días gratis",
    cancelAnytime: "Cancela cuando quieras",
  },
  courses: {
    title: "Nuestros Cursos",
    subtitle: "Aprende de los mejores artistas marciales del mundo",
    allDisciplines: "Todas las Disciplinas",
    mma: "MMA",
    kickboxing: "Kickboxing",
    grappling: "Grappling",
    lessons: "lecciones",
    minutes: "min",
    viewCourse: "Ver Curso",
    startLearning: "Empezar",
    continueLearning: "Continuar",
  },
  pricing: {
    title: "Entrena Como un Campeón",
    subtitle: "Acceso ilimitado a instrucción de artes marciales de clase mundial",
    monthly: "Mensual",
    annual: "Anual",
    perMonth: "/mes",
    perYear: "/año",
    save: "Ahorra",
    mostPopular: "Más Popular",
    startMonthly: "Empezar Mensual",
    getAnnual: "Obtener Anual",
    features: {
      unlimitedAccess: "Acceso ilimitado a todos los cursos",
      newContentWeekly: "Contenido nuevo cada semana",
      hdVideo: "Video en HD",
      coachFeedback: "Feedback de entrenadores",
      cancelAnytime: "Cancela cuando quieras",
      certificates: "Certificados de cursos",
    },
  },
  dashboard: {
    welcome: "Bienvenido de nuevo",
    continueLearning: "Continuar Aprendiendo",
    recentActivity: "Actividad Reciente",
    recommended: "Recomendado Para Ti",
    progress: "Progreso",
    completed: "Completado",
    streak: "Racha de Días",
    watchTime: "Tiempo de Estudio",
  },
};

// Dictionary loader
const dictionaries: Record<Locale, Dictionary> = {
  en,
  de,
  es,
  pt: es, // Using Spanish as fallback for Portuguese
  fr: en, // Using English as fallback for French
};

export function getDictionary(locale: Locale = defaultLocale): Dictionary {
  return dictionaries[locale] || dictionaries[defaultLocale];
}
