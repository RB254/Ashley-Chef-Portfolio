import { createInsertSchema } from "drizzle-zod";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const experiencesTable = pgTable("experiences", {
  id: serial("id").primaryKey(),
  company: text("company").notNull(),
  position: text("position").notNull(),
  dates: text("dates").notNull(),
  responsibilities: jsonb("responsibilities").$type<string[]>().notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const educationTable = pgTable("education", {
  id: serial("id").primaryKey(),
  institution: text("institution").notNull(),
  period: text("period").notNull(),
  qualification: text("qualification").notNull(),
  field: text("field"),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const skillCategoriesTable = pgTable("skill_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  skills: jsonb("skills").$type<string[]>().notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const galleryItemsTable = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description"),
  imageUrl: text("image_url").notNull(),
  alt: text("alt").notNull(),
  featured: boolean("featured").notNull().default(false),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const languagesTable = pgTable("languages", {
  id: serial("id").primaryKey(),
  language: text("language").notNull(),
  proficiency: text("proficiency").notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const interestsTable = pgTable("interests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const referencesTable = pgTable("references", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(),
  company: text("company"),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const contactMessagesTable = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  opportunity: text("opportunity"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertContactMessageSchema = createInsertSchema(
  contactMessagesTable,
).omit({ id: true, createdAt: true });

export type Experience = typeof experiencesTable.$inferSelect;
export type Education = typeof educationTable.$inferSelect;
export type SkillCategory = typeof skillCategoriesTable.$inferSelect;
export type GalleryItem = typeof galleryItemsTable.$inferSelect;
export type Language = typeof languagesTable.$inferSelect;
export type Interest = typeof interestsTable.$inferSelect;
export type Reference = typeof referencesTable.$inferSelect;
export type ContactMessage = typeof contactMessagesTable.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;