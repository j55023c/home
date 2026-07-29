import { z } from "zod";
import { base } from "../__core/app";
import { supabase } from "../database/supabase";

/**
 * Mapeia os dados do Supabase (tabela imoveis) para o formato que o frontend espera
 * Schema Supabase (imoveis): id, titulo, tipo, finalidade, preco, endereco, bairro, cidade, 
 *   quartos, banheiros, vagas, area_m2, area_util, suites, ano_construcao, iptu, condominio, taxas,
 *   caracteristicas, descricao, corretora_id, destaque, status, publicado, created_at, updated_at
 * 
 * Schema Frontend (Property): id, title, purpose, type, price, city, neighborhood, state, 
 *   bedrooms, bathrooms, parking, area, description, images, features, featured, reference, createdAt
 */

function mapImovelToProperty(imovel: any, fotos: string[] = []) {
  const purposeMap: Record<string, string> = {
    venda: "venda",
    aluguel: "aluguel",
  };
  const typeMap: Record<string, string> = {
    casa: "casa",
    apartamento: "apartamento",
    cobertura: "cobertura",
    terreno: "terreno",
    comercial: "comercial",
  };

  return {
    id: imovel.id,
    title: imovel.titulo,
    purpose: purposeMap[imovel.finalidade] ?? imovel.finalidade,
    type: typeMap[imovel.tipo] ?? imovel.tipo,
    price: imovel.preco ?? 0,
    city: imovel.cidade ?? "",
    neighborhood: imovel.bairro ?? "",
    state: "SP", // padrão, pode vir da corretora depois
    bedrooms: imovel.quartos ?? 0,
    bathrooms: imovel.banheiros ?? 0,
    parking: imovel.vagas ?? 0,
    area: imovel.area_m2 ?? 0,
    description: imovel.descricao ?? "",
    images: fotos.length > 0 ? fotos : (imovel.imagens ? JSON.parse(imovel.imagens) : []),
    features: imovel.caracteristicas ?? [],
    featured: imovel.destaque ?? false,
    reference: imovel.referencia ?? "",
    createdAt: imovel.created_at,
    // campos extras do Supabase que o frontend pode usar
    _raw: {
      status: imovel.status,
      publicado: imovel.publicado,
      endereco: imovel.endereco, // endereço completo - NÃO mostrar no site público
      iptu: imovel.iptu,
      condominio: imovel.condominio,
      taxas: imovel.taxas,
      area_util: imovel.area_util,
      suites: imovel.suites,
      ano_construcao: imovel.ano_construcao,
      corretora_id: imovel.corretora_id,
      updated_at: imovel.updated_at,
    },
  };
}

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
      let query = supabase
        .from("imoveis")
        .select("*")
        .eq("publicado", true) // só imóveis publicados no site
        .order("created_at", { ascending: false });

      if (input?.purpose) query = query.eq("finalidade", input.purpose);
      if (input?.type) query = query.eq("tipo", input.type);
      if (input?.city) query = query.eq("cidade", input.city);
      if (input?.minPrice != null) query = query.gte("preco", input.minPrice);
      if (input?.maxPrice != null) query = query.lte("preco", input.maxPrice);
      if (input?.bedrooms != null) query = query.gte("quartos", input.bedrooms);
      if (input?.search) {
        const q = `%${input.search}%`;
        query = query.or(`titulo.ilike.${q},bairro.ilike.${q},cidade.ilike.${q}`);
      }

      const { data: imoveis, error } = await query;
      if (error) throw new Error(`Erro ao buscar imóveis: ${error.message}`);

      if (!imoveis || imoveis.length === 0) return [];

      // Buscar fotos em paralelo
      const ids = imoveis.map((i) => i.id);
      const { data: fotos } = await supabase
        .from("imovel_fotos")
        .select("imovel_id, url")
        .in("imovel_id", ids)
        .order("ordem", { ascending: true });

      const fotosPorImovel: Record<string, string[]> = {};
      (fotos ?? []).forEach((f) => {
        if (!fotosPorImovel[f.imovel_id]) fotosPorImovel[f.imovel_id] = [];
        fotosPorImovel[f.imovel_id].push(f.url);
      });

      return imoveis.map((imovel) => mapImovelToProperty(imovel, fotosPorImovel[imovel.id] ?? []));
    }),

  featured: base.handler(async () => {
    const { data: imoveis, error } = await supabase
      .from("imoveis")
      .select("*")
      .eq("publicado", true)
      .eq("destaque", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (error) throw new Error(`Erro ao buscar destaques: ${error.message}`);
    if (!imoveis || imoveis.length === 0) return [];

    const ids = imoveis.map((i) => i.id);
    const { data: fotos } = await supabase
      .from("imovel_fotos")
      .select("imovel_id, url")
      .in("imovel_id", ids)
      .order("ordem", { ascending: true });

    const fotosPorImovel: Record<string, string[]> = {};
    (fotos ?? []).forEach((f) => {
      if (!fotosPorImovel[f.imovel_id]) fotosPorImovel[f.imovel_id] = [];
      fotosPorImovel[f.imovel_id].push(f.url);
    });

    return imoveis.map((imovel) => mapImovelToProperty(imovel, fotosPorImovel[imovel.id] ?? []));
  }),

  get: base.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    const { data: imovel, error } = await supabase
      .from("imoveis")
      .select("*")
      .eq("id", input.id)
      .eq("publicado", true) // segurança: não retorna não-publicados
      .single();

    if (error || !imovel) throw new Error("Imóvel não encontrado");

    const { data: fotos } = await supabase
      .from("imovel_fotos")
      .select("url")
      .eq("imovel_id", input.id)
      .order("ordem", { ascending: true });

    return mapImovelToProperty(imovel, (fotos ?? []).map((f) => f.url));
  }),

  cities: base.handler(async () => {
    const { data, error } = await supabase
      .from("imoveis")
      .select("cidade")
      .eq("publicado", true);

    if (error) throw new Error(`Erro ao buscar cidades: ${error.message}`);
    const cidades = [...new Set((data ?? []).map((i) => i.cidade).filter(Boolean))].sort();
    return cidades;
  }),
};