export const FALLBACK_PROFILE = {
  name: "Ashley Amani Wambura",
  title: "Pastry & Bakery Professional",
  statement:
    "Passionate about pastry, bakery, precision and creating memorable culinary experiences.",
  phone: "0110768711",
  email: "amaniashley107@gmail.com",
  location: "Nairobi, Kenya",
  cvUrl: "/Ashley-Amani-Wambura-CV.pdf",
};

export const FALLBACK_EXPERIENCES = [
  {
    id: 1,
    company: "Hemingways Nairobi",
    position: "Pastry Cook",
    dates: "12 January – 12 April",
    responsibilities: [
      "Measured ingredients precisely by weight according to standardized formulas.",
      "Baked doughs, batters, tarts, cookies, pies, cakes and artisanal breads.",
      "Prepared fillings, icings, glazes, custards, mousses and sauces.",
      "Operated commercial kitchen equipment safely, including industrial mixers, dough sheeters and deck ovens.",
    ],
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: 2,
    company: "Novotel Nairobi Westlands",
    position: "Pastry Cook",
    dates: "1 July – 10 August",
    responsibilities: [
      "Decorated cakes and pastries using piping, glazing and frosting techniques.",
      "Plated individual desserts during live service while maintaining visual consistency.",
      "Prepared garnishes, coulis and service tools.",
      "Organized daily mise en place and prepared nuts, chocolate and fresh fruits.",
      "Used labeling, dating and FIFO stock rotation.",
      "Maintained sanitation and health requirements.",
    ],
    sortOrder: 2,
    isVisible: true,
  },
];

export const FALLBACK_EDUCATION = [
  {
    id: 1,
    institution: "Kibondeni College",
    period: "2025",
    qualification:
      "Certificate in Food and Beverage Production, Service, Housekeeping and Laundry",
    field: "Food and Beverage",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: 2,
    institution: "Oshwal College",
    period: "2022–2024",
    qualification: "Pearson BTEC Diploma in Information Technology",
    field: "Information Technology",
    sortOrder: 2,
    isVisible: true,
  },
  {
    id: 3,
    institution: "Kestrel Manor High School",
    period: "2018–2021",
    qualification:
      "International General Certificate of Secondary Education (IGCSE)",
    field: null,
    sortOrder: 3,
    isVisible: true,
  },
  {
    id: 4,
    institution: "Grace Harvest Academy",
    period: "2006–2017",
    qualification: "Kenya Certificate of Primary Education (KCPE)",
    field: null,
    sortOrder: 4,
    isVisible: true,
  },
];

export const FALLBACK_SKILLS = [
  {
    id: 1,
    name: "Pastry & Bakery",
    skills: [
      "Doughs",
      "Batters",
      "Tarts",
      "Cookies",
      "Pies",
      "Cakes",
      "Artisanal breads",
      "Fillings",
      "Icings",
      "Glazes",
      "Custards",
      "Mousses",
      "Sauces",
    ],
    sortOrder: 1,
  },
  {
    id: 2,
    name: "Decoration & Presentation",
    skills: [
      "Cake decoration",
      "Piping",
      "Glazing",
      "Frosting",
      "Dessert plating",
      "Visual presentation",
    ],
    sortOrder: 2,
  },
  {
    id: 3,
    name: "Kitchen Operations",
    skills: [
      "Mise en place",
      "Kitchen organization",
      "Ingredient preparation",
      "FIFO stock rotation",
      "Commercial kitchen equipment",
    ],
    sortOrder: 3,
  },
  {
    id: 4,
    name: "Food Safety & Hygiene",
    skills: [
      "Food hygiene",
      "Sanitation",
      "Safe equipment operation",
      "Ingredient freshness monitoring",
      "Health-code compliance",
    ],
    sortOrder: 4,
  },
];

export const FALLBACK_LANGUAGES = [
  {
    id: 1,
    language: "English",
    proficiency: "Fluent — Spoken & Written",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: 2,
    language: "Swahili",
    proficiency: "Fluent — Spoken & Written",
    sortOrder: 2,
    isVisible: true,
  },
];

export const FALLBACK_INTERESTS = [
  { id: 1, name: "Travelling", sortOrder: 1, isVisible: true },
  { id: 2, name: "Adventure", sortOrder: 2, isVisible: true },
  { id: 3, name: "Reading", sortOrder: 3, isVisible: true },
];

export const FALLBACK_REFERENCES = [
  {
    id: 1,
    name: "Chef Readon Namutenda",
    position: "Pastry Chef",
    company: "Novotel",
    phone: "0706635462",
    email: "tonnymisango@gmail.com",
    sortOrder: 1,
    isVisible: true,
  },
  {
    id: 2,
    name: "Chef Oscar Mfogo",
    position: "Executive Chef",
    company: null,
    phone: "0725135234",
    email: "mfogooscar@gmail.com",
    sortOrder: 2,
    isVisible: true,
  },
];

export const FALLBACK_GALLERY = Array.from({ length: 39 }, (_, index) => ({
  id: index + 1,
  title: "Baked Creation",
  category: "Culinary Journey",
  description: null,
  imageUrl: `/gallery/gallery-${String(index + 1).padStart(2, "0")}.jpg`,
  alt: "Ashley’s culinary work",
  featured: index < 6,
  sortOrder: index + 1,
  isVisible: true,
}));

export const FALLBACK_FEATURED = FALLBACK_GALLERY.filter((item) => item.featured);

export const FALLBACK_SUMMARY = {
  experienceCount: FALLBACK_EXPERIENCES.length,
  educationCount: FALLBACK_EDUCATION.length,
  galleryCount: FALLBACK_GALLERY.length,
  skillCategoryCount: FALLBACK_SKILLS.length,
};

export function getFallbackForPath(pathname: string): unknown | undefined {
  const clean = pathname.split("?")[0].replace(/\/$/, "");

  if (clean.endsWith("/api/profile")) return FALLBACK_PROFILE;
  if (clean.endsWith("/api/experiences")) return FALLBACK_EXPERIENCES;
  if (clean.endsWith("/api/education")) return FALLBACK_EDUCATION;
  if (clean.endsWith("/api/skills")) return FALLBACK_SKILLS;
  if (clean.endsWith("/api/gallery")) return FALLBACK_GALLERY;
  if (clean.endsWith("/api/featured-work")) return FALLBACK_FEATURED;
  if (clean.endsWith("/api/languages")) return FALLBACK_LANGUAGES;
  if (clean.endsWith("/api/interests")) return FALLBACK_INTERESTS;
  if (clean.endsWith("/api/references")) return FALLBACK_REFERENCES;
  if (clean.endsWith("/api/portfolio-summary")) return FALLBACK_SUMMARY;
  if (clean.endsWith("/api/healthz")) return { status: "ok" };
  if (clean.endsWith("/api/contact")) {
    return {
      success: true,
      message: "Thank you. Ashley will be in touch soon.",
    };
  }

  return undefined;
}
