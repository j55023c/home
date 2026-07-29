import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

/**
 * Imóveis da vitrine da imobiliária.
 */
export const properties = sqliteTable("properties", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  purpose: text("purpose").notNull(), // "venda" | "aluguel"
  type: text("type").notNull(), // "casa" | "apartamento" | "cobertura" | "terreno" | "comercial"
  price: integer("price").notNull(), // em reais
  city: text("city").notNull(),
  neighborhood: text("neighborhood").notNull(),
  state: text("state").notNull().default("SP"),
  bedrooms: integer("bedrooms").notNull().default(0),
  suites: integer("suites").notNull().default(0),
  bathrooms: integer("bathrooms").notNull().default(0),
  parking: integer("parking").notNull().default(0),
  area: real("area").notNull().default(0), // m2
  description: text("description").notNull().default(""),
  images: text("images", { mode: "json" }).notNull().$type<string[]>().default([]),
  features: text("features", { mode: "json" }).notNull().$type<string[]>().default([]),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  reference: text("reference").notNull().default(""),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

/**
 * Leads / mensagens de contato enviadas pelo site.
 */
export const leads = sqliteTable("leads", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  message: text("message").notNull().default(""),
  propertyId: integer("property_id"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Property = typeof properties.$inferSelect;
export type Lead = typeof leads.$inferSelect;
