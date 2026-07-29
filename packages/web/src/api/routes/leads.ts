import { z } from "zod";
import { base } from "../__core/app";
import { supabase } from "../database/supabase";

export const leads = {
  create: base
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().optional(),
        propertyId: z.string().optional(), // agora é string (UUID do Supabase)
      }),
    )
    .handler(async ({ input }) => {
      const { data: lead, error } = await supabase
        .from("leads")
        .insert({
          name: input.name,
          email: input.email,
          phone: input.phone ?? "",
          message: input.message ?? "",
          property_id: input.propertyId ?? null,
        })
        .select()
        .single();

      if (error) throw new Error(`Erro ao criar lead: ${error.message}`);
      return lead;
    }),
};