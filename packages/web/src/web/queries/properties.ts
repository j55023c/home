import { useInfiniteQuery, useMutation } from '@tanstack/react-query'
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

// Mapeamento de fallback para corretoras sem foto no Supabase
const CORRETORA_FALLBACK_IMAGES: Record<string, string> = {
  'Liliane de Lima Texeira': '/images/team/liliane.png',
  'Liliane de Lima Teixeira': '/images/team/liliane.png',
  'Marilza Galante': '/images/team/marilza.png',
  'Silvana Garcia': '/images/team/silvana.png',
  '9821': '/images/team/liliane.png',
  '6618': '/images/team/marilza.png',
  '8889': '/images/team/silvana.png',
}

function getCorretoraImage(corretora: { nome?: string; creci?: string | null; foto_url?: string | null } | null): string | null {
  if (!corretora) return null
  
  // 1. Prioridade: foto_url do Supabase (Storage)
  if (corretora.foto_url) {
    return corretora.foto_url
  }
  
  // 2. Fallback: mapeamento local por nome exato
  if (corretora.nome && CORRETORA_FALLBACK_IMAGES[corretora.nome]) {
    return CORRETORA_FALLBACK_IMAGES[corretora.nome]
  }
  
  // 3. Fallback: por CRECI (últimos 4 dígitos)
  if (corretora.creci) {
    const creciNum = corretora.creci.replace(/\D/g, '').slice(-4)
    if (CORRETORA_FALLBACK_IMAGES[creciNum]) {
      return CORRETORA_FALLBACK_IMAGES[creciNum]
    }
  }
  
  return null
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

  // Pega a foto da corretora (prioriza foto_url do Supabase, cai pro fallback local)
  const corretoraImage = getCorretoraImage(corretora)

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
      foto: corretoraImage,
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

async function fetchCorretoras(corretoraIds: string[]): Promise<Record<string, any>> {
  if (!corretoraIds.length) return {}
  
  try {
    const { data, error } = await supabase
      .from('corretoras')
      .select('id, nome, telefone, whatsapp, creci, foto_url')
      .in('id', corretoraIds)
  
    if (error) {
      console.warn('[corretoras] fetch error:', error.message)
      return {}
    }
  
    const map: Record<string, any> = {}
    ;(data ?? []).forEach((c: any) => {
      map[c.id] = c
    })
    console.log('[corretoras] success with select id,nome,telefone,whatsapp,creci,foto_url')
    return map
  } catch (e) {
    console.warn('[corretoras] fetch exception:', e)
    return {}
  }
}

async function fetchFotos(imovelIds: string[]): Promise<Record<string, string[]>> {
  if (!imovelIds.length) return {}
  try {
    const { data, error } = await supabase
      .from('imovel_fotos')
      .select('imovel_id, url, ordem')
      .in('imovel_id', imovelIds)
      .order('ordem', { ascending: true })
    if (error) {
      console.warn('[fotos] fetch error:', error.message)
      return {}
    }
    const map: Record<string, string[]> = {}
    ;(data ?? []).forEach((f: any) => {
      if (!map[f.imovel_id]) map[f.imovel_id] = []
      map[f.imovel_id].push(f.url)
    })
    return map
  } catch (e) {
    console.warn('[fotos] fetch exception:', e)
    return {}
  }
}

async function fetchPropertiesPage(
  filters: PropertyFilters | undefined,
  page: number
): Promise<SupabaseProperty[]> {
  const from = page * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from('imoveis')
    .select('*')
    .eq('publicado', true)
    .order('created_at', { ascending: false })
    .range(from, to)

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

  const imovelIds = imoveis.map((i: any) => i.id)
  const corretoraIds = [...new Set(imoveis.map((i: any) => i.corretora_id).filter(Boolean))]

  const [fotosMap, corretorasMap] = await Promise.all([
    fetchFotos(imovelIds),
    fetchCorretoras(corretoraIds),
  ])

  return imoveis.map((imovel: any) =>
    mapImovelToProperty(imovel, fotosMap[imovel.id] ?? [], corretorasMap[imovel.corretora_id] ?? null)
  )
}

const PAGE_SIZE = 12

export function useProperties(filters?: PropertyFilters) {
  return useInfiniteQuery({
    queryKey: ['properties', filters],
    queryFn: ({ pageParam = 0 }) => fetchPropertiesPage(filters, pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined
    },
    staleTime: 30_000,
  })
}

export function useAllProperties(filters?: PropertyFilters) {
  const { data, ...rest } = useProperties(filters)
  const allProperties = data?.pages.flat() ?? []
  return { data: allProperties, ...rest }
}

export function useFeaturedProperties() {
  return useQuery({
    queryKey: ['properties', 'featured'],
    queryFn: async () => {
      const { data: imoveis, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('publicado', true)
        .eq('destaque', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw new Error(`Erro ao buscar destaques: ${error.message}`)
      if (!imoveis || imoveis.length === 0) return []

      const imovelIds = imoveis.map((i: any) => i.id)
      const corretoraIds = [...new Set(imoveis.map((i: any) => i.corretora_id).filter(Boolean))]

      const [fotosMap, corretorasMap] = await Promise.all([
        fetchFotos(imovelIds),
        fetchCorretoras(corretoraIds),
      ])

      return imoveis.map((imovel: any) =>
        mapImovelToProperty(imovel, fotosMap[imovel.id] ?? [], corretorasMap[imovel.corretora_id] ?? null)
      )
    },
  })
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data: imovel, error } = await supabase
        .from('imoveis')
        .select('*')
        .eq('id', id)
        .eq('publicado', true)
        .single()

      if (error || !imovel) throw new Error('Imóvel não encontrado')

      const [fotosMap, corretorasMap] = await Promise.all([
        fetchFotos([imovel.id]),
        imovel.corretora_id ? fetchCorretoras([imovel.corretora_id]) : Promise.resolve({}),
      ])

      return mapImovelToProperty(
        imovel,
        fotosMap[imovel.id] ?? [],
        corretorasMap[imovel.corretora_id] ?? null
      )
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