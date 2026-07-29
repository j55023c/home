import { z } from "zod";
import { and, desc, eq, gte, lte, like, or } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";
import { ORPCError } from "@orpc/server";

export const properties = {
  list: base
    .input(
      z
        .object({
          purpose: z.string().optional(),
          type: z.string().optional(),
          city: z.string().optional(),
          minPrice: z.number().optional(),
          maxPrice: z.number().optional(),
          bedrooms: z.number().optional(),
          search: z.string().optional(),
        })
        .optional(),
    )
    .handler(async ({ input }) => {
      const conditions = [];
      if (input?.purpose) conditions.push(eq(schema.properties.purpose, input.purpose));
      if (input?.type) conditions.push(eq(schema.properties.type, input.type));
      if (input?.city) conditions.push(eq(schema.properties.city, input.city));
      if (input?.minPrice != null) conditions.push(gte(schema.properties.price, input.minPrice));
      if (input?.maxPrice != null) conditions.push(lte(schema.properties.price, input.maxPrice));
      if (input?.bedrooms != null) conditions.push(gte(schema.properties.bedrooms, input.bedrooms));
      if (input?.search) {
        const q = `%${input.search}%`;
        conditions.push(
          or(
            like(schema.properties.title, q),
            like(schema.properties.neighborhood, q),
            like(schema.properties.city, q),
          )!,
        );
      }
      return db
        .select()
        .from(schema.properties)
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(schema.properties.featured), desc(schema.properties.createdAt));
    }),

  featured: base.handler(() =>
    db
      .select()
      .from(schema.properties)
      .where(eq(schema.properties.featured, true))
      .orderBy(desc(schema.properties.createdAt))
      .limit(6),
  ),

  get: base.input(z.object({ id: z.number() })).handler(async ({ input }) => {
    const [property] = await db
      .select()
      .from(schema.properties)
      .where(eq(schema.properties.id, input.id));
    if (!property) throw new ORPCError("NOT_FOUND", { message: "Imóvel não encontrado" });
    return property;
  }),

  cities: base.handler(async () => {
    const rows = await db
      .selectDistinct({ city: schema.properties.city })
      .from(schema.properties)
      .orderBy(schema.properties.city);
    return rows.map((r) => r.city);
  }),
};
