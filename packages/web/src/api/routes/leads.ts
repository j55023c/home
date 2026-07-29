import { z } from "zod";
import { base } from "../__core/app";
import { db } from "../database";
import * as schema from "../database/schema";

export const leads = {
  create: base
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().optional(),
        propertyId: z.number().optional(),
      }),
    )
    .handler(async ({ input }) => {
      const [lead] = await db
        .insert(schema.leads)
        .values({
          name: input.name,
          email: input.email,
          phone: input.phone ?? "",
          message: input.message ?? "",
          propertyId: input.propertyId ?? null,
        })
        .returning();
      return lead;
    }),
};
