import { useQuery, useMutation } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export interface PropertyFilters {
  purpose?: string
  type?: string
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  search?: string
}

export interface SupabaseProperty {
  id: string
  title: string
  purpose: string
  type: string
  price: number
  city: string
  neighborhood: string
  state: string
  bedrooms: number
  bathrooms: number
  parking: number
  area: number
  description: string
  images: string[]
  features: string[]
  featured: boolean
  reference: string
  createdAt: string
  corretora?: {
    id: string
    nome: string
    foto: string | null
    telefone: string | null
    email: string | null
    creci: string | null
  } | null
  _raw?: {
    status: string
    publicado: boolean
    endereco: string | null
    iptu: number | null
    condominio: number | null
    taxas: number | null
    area_util: number | null
    suites: number | null
    ano_construcao: number | null
    corretora_id: string
    updated_at: string
  }
}

function mapImovelToProperty(imovel: any, fotos: string[] = [], corretora: any = null): SupabaseProperty {
  const purposeMap: Record<string, string> = {
    venda: 'venda',
    aluguel: 'aluguel',
  }
  const typeMap: Record<string, string> = {
    casa: 'casa',
    apartamento: 'apartamento',
    cobertura: 'cobertura',
    terreno: 'terreno',
    comercial: 'comercial',
  }

  return {
    id: imovel.id,
    title: imovel.titulo,
    purpose: purposeMap[imovel.finalidade] ?? imovel.finalidade,
    type: typeMap[imovel.tipo] ?? imovel.tipo,
    price: imovel.preco ?? 0,
    city: imovel.cidade ?? '',
    neighborhood: imovel.bairro ?? '',
    state: 'SP',
    bedrooms: imovel.quartos ?? 0,
    bathrooms: imovel.banheiros ?? 0,
    parking: imovel.vagas ?? 0,
    area: imovel.area_m2 ?? 0,
    description: imovel.descricao ?? '',
    images: fotos.length > 0 ? fotos : (imovel.imagens ? JSON.parse(imovel.imagens) : []),
    features: imovel.caracteristicas ?? [],
    featured: imovel.destaque ?? false,
    reference: imovel.referencia ?? '',
    createdAt: imovel.created_at,
    corretora: corretora ? {
      id: corretora.id,
      nome: corretora.nome,
      foto: corretora.foto,
      telefone: corretora.telefone,
      email: corretora.email,
      creci: corretora.creci,
    } : null,
    _raw: {
      status: imovel.status,
      publicado: imovel.publicado,
      endereco: imovel.endereco,
      iptu: imovel.iptu,
      condominio: imovel.condominio,
      taxas: imovel.taxas,
      area_util: imovel.area_util,
      suites: imovel.suites,
      ano_construcao: imovel.ano_construcao,
      corretora_id: imovel.corretora_id,
      updated_at: imovel.updated_at,
    },
  }
}

export function useProperties(filters?: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      let query = supabase
        .from('imoveis')
        .select(`
          *,
          imovel_fotos (url, ordem),
          corretoras (id, nome, foto, telefone, email, creci)
        `)
        .eq('publicado', true)
        .order('created_at', { ascending: false })

      if (filters?.purpose) query = query.eq('finalidade', filters.purpose)
      if (filters?.type) query = query.eq('tipo', filters.type)
      if (filters?.city) query = query.eq('cidade', filters.city)
      if (filters?.minPrice != null) query = query.gte('preco', filters.minPrice)
      if (filters?.maxPrice != null) query = query.lte('preco', filters.maxPrice)
      if (filters?.bedrooms != null) query = query.gte('quartos', filters.bedrooms)
      if (filters?.search) {
        const q = `%${filters.search}%`
        query = query.or(`titulo.ilike.${q},bairro.ilike.${q},cidade.ilike.${q}`)
      }

      const { data: imoveis, error } = await query
      if (error) throw new Error(`Erro ao buscar imóveis: ${error.message}`)
      if (!imoveis || imoveis.length === 0) return []

      return imoveis.map((imovel: any) => {
        const fotos = imovel.imovel_fotos
          ?.sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0))
          .map((f: any) => f.url) ?? []
        const corretora = imovel.corretoras?.[0] ?? null
        return mapImovelToProperty(imovel, fotos, corretora)
      })
    },
  })
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: async () => {
      const { data: imoveis, error } = await supabase
        .from('imoveis')
        .select(`
          *,
          imovel_fotos (url, ordem),
          corretoras (id, nome, foto, telefone, email, creci)
        `)
        .eq('publicado', true)
        .eq('destaque', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw new Error(`Erro ao buscar destaques: ${error.message}`)
      if (!imoveis || imoveis.length === 0) return []

      return imoveis.map((imovel: any) => {
        const fotos = imovel.imovel_fotos
          ?.sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0))
          .map((f: any) => f.url) ?? []
        const corretora = imovel.corretoras?.[0] ?? null
        return mapImovelToProperty(imovel, fotos, corretora)
      })
    },
  })
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data: imovel, error } = await supabase
        .from('imoveis')
        .select(`
          *,
          imovel_fotos (url, ordem),
          corretoras (id, nome, foto, telefone, email, creci)
        `)
        .eq('id', id)
        .eq('publicado', true)
        .single()

      if (error || !imovel) throw new Error('Imóvel não encontrado')

      const fotos = imovel.imovel_fotos
        ?.sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0))
        .map((f: any) => f.url) ?? []
      const corretora = imovel.corretoras?.[0] ?? null

      return mapImovelToProperty(imovel, fotos, corretora)
    },
    enabled: !!id,
    staleTime: 30_000,
  })
}

export function useCities() {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('imoveis')
        .select('cidade')
        .eq('publicado', true)

      if (error) throw new Error(`Erro ao buscar cidades: ${error.message}`)
      const cidades = [...new Set((data ?? []).map((i: any) => i.cidade).filter(Boolean))].sort()
      return cidades
    },
  })
}

export function useCreateLead() {
  return useMutation({
    mutationFn: async (lead: { nome: string; telefone: string; email?: string; mensagem?: string; imovel_id?: string }) => {
      const { data, error } = await supabase
        .from('leads')
        .insert([lead])
        .select()
        .single()

      if (error) throw new Error(`Erro ao criar lead: ${error.message}`)
      return data
    },
  })
}