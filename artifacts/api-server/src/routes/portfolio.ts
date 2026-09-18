import { Router, type IRouter } from "express";
import { and, asc, eq } from "drizzle-orm";
import {
  GetGalleryQueryParams,
  SubmitContactBody,
} from "@workspace/api-zod";
import { db } from "@workspace/db";
import {
  contactMessagesTable,
  educationTable,
  experiencesTable,
  galleryItemsTable,
  insertContactMessageSchema,
  interestsTable,
  languagesTable,
  referencesTable,
  skillCategoriesTable,
} from "@workspace/db";

const router: IRouter = Router();

let seedPromise: Promise<void> | undefined;

async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = seedPortfolio();
  }
  await seedPromise;
}

async function seedPortfolio() {
  const existing = await db
    .select({ id: experiencesTable.id })
    .from(experiencesTable)
    .limit(1);

  if (existing.length > 0) return;

  await db.insert(experiencesTable).values([
    {
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
    },
    {
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
    },
  ]);

  await db.insert(educationTable).values([
    {
      institution: "Kibondeni College",
      period: "2025",
      qualification: "Certificate in Food and Beverage Production, Service, Housekeeping and Laundry",
      field: "Food and Beverage",
      sortOrder: 1,
    },
    {
      institution: "Oshwal College",
      period: "2022–2024",
      qualification: "Pearson BTEC Diploma in Information Technology",
      field: "Information Technology",
      sortOrder: 2,
    },
    {
      institution: "Kestrel Manor High School",
      period: "2018–2021",
      qualification: "International General Certificate of Secondary Education (IGCSE)",
      field: null,
      sortOrder: 3,
    },
    {
      institution: "Grace Harvest Academy",
      period: "2006–2017",
      qualification: "Kenya Certificate of Primary Education (KCPE)",
      field: null,
      sortOrder: 4,
    },
  ]);

  await db.insert(skillCategoriesTable).values([
    {
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
  ]);

  await db.insert(languagesTable).values([
    { language: "English", proficiency: "Fluent — Spoken & Written", sortOrder: 1 },
    { language: "Swahili", proficiency: "Fluent — Spoken & Written", sortOrder: 2 },
  ]);

  await db.insert(interestsTable).values([
    { name: "Travelling", sortOrder: 1 },
    { name: "Adventure", sortOrder: 2 },
    { name: "Reading", sortOrder: 3 },
  ]);

  await db.insert(referencesTable).values([
    {
      name: "Chef Readon Namutenda",
      position: "Pastry Chef",
      company: "Novotel",
      phone: "0706635462",
      email: "tonnymisango@gmail.com",
      sortOrder: 1,
    },
    {
      name: "Chef Oscar Mfogo",
      position: "Executive Chef",
      company: null,
      phone: "0725135234",
      email: "mfogooscar@gmail.com",
      sortOrder: 2,
    },
  ]);

  await db.insert(galleryItemsTable).values(
    Array.from({ length: 39 }, (_, index) => ({
      title: "Baked Creation",
      category: "Culinary Journey",
      description: null,
      imageUrl: `/gallery/gallery-${String(index + 1).padStart(2, "0")}.jpg`,
      alt: "Ashley’s culinary work",
      featured: index < 6,
      sortOrder: index + 1,
    })),
  );
}

router.get("/profile", (_req, res) => {
  res.json({
    name: "Ashley Amani Wambura",
    title: "Pastry & Bakery Professional",
    statement:
      "Passionate about pastry, bakery, precision and creating memorable culinary experiences.",
    phone: "0110768711",
    email: "amaniashley107@gmail.com",
    location: "Nairobi, Kenya",
    cvUrl: "/Ashley-Amani-Wambura-CV.pdf",
  });
});

router.get("/experiences", async (_req, res) => {
  await ensureSeeded();
  const data = await db
    .select()
    .from(experiencesTable)
    .where(eq(experiencesTable.isVisible, true))
    .orderBy(asc(experiencesTable.sortOrder));
  res.json(data);
});

router.get("/education", async (_req, res) => {
  await ensureSeeded();
  const data = await db
    .select()
    .from(educationTable)
    .where(eq(educationTable.isVisible, true))
    .orderBy(asc(educationTable.sortOrder));
  res.json(data);
});

router.get("/skills", async (_req, res) => {
  await ensureSeeded();
  const data = await db
    .select()
    .from(skillCategoriesTable)
    .orderBy(asc(skillCategoriesTable.sortOrder));
  res.json(data);
});

router.get("/gallery", async (req, res) => {
  await ensureSeeded();
  const params = GetGalleryQueryParams.parse(req.query);
  const where = params.category
    ? and(
        eq(galleryItemsTable.isVisible, true),
        eq(galleryItemsTable.category, params.category),
      )
    : eq(galleryItemsTable.isVisible, true);
  const data = await db
    .select()
    .from(galleryItemsTable)
    .where(where)
    .orderBy(asc(galleryItemsTable.sortOrder));
  res.json(data);
});

router.get("/featured-work", async (_req, res) => {
  await ensureSeeded();
  const data = await db
    .select()
    .from(galleryItemsTable)
    .where(
      and(
        eq(galleryItemsTable.isVisible, true),
        eq(galleryItemsTable.featured, true),
      ),
    )
    .orderBy(asc(galleryItemsTable.sortOrder));
  res.json(data);
});

router.get("/languages", async (_req, res) => {
  await ensureSeeded();
  const data = await db
    .select()
    .from(languagesTable)
    .where(eq(languagesTable.isVisible, true))
    .orderBy(asc(languagesTable.sortOrder));
  res.json(data);
});

router.get("/interests", async (_req, res) => {
  await ensureSeeded();
  const data = await db
    .select()
    .from(interestsTable)
    .where(eq(interestsTable.isVisible, true))
    .orderBy(asc(interestsTable.sortOrder));
  res.json(data);
});

router.get("/references", async (_req, res) => {
  await ensureSeeded();
  const data = await db
    .select()
    .from(referencesTable)
    .where(eq(referencesTable.isVisible, true))
    .orderBy(asc(referencesTable.sortOrder));
  res.json(data);
});

router.get("/portfolio-summary", async (_req, res) => {
  await ensureSeeded();
  const [experiences, education, gallery, skills] = await Promise.all([
    db.select({ id: experiencesTable.id }).from(experiencesTable),
    db.select({ id: educationTable.id }).from(educationTable),
    db.select({ id: galleryItemsTable.id }).from(galleryItemsTable),
    db.select({ id: skillCategoriesTable.id }).from(skillCategoriesTable),
  ]);
  res.json({
    experienceCount: experiences.length,
    educationCount: education.length,
    galleryCount: gallery.length,
    skillCategoryCount: skills.length,
  });
});

router.post("/contact", async (req, res) => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: "Please check the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }

  const record = insertContactMessageSchema.parse({
    ...parsed.data,
    company: parsed.data.company || null,
    opportunity: parsed.data.opportunity || null,
    status: "new",
  });
  await db.insert(contactMessagesTable).values(record);
  res.status(201).json({
    success: true,
    message: "Thank you. Ashley will be in touch soon.",
  });
});

export default router;