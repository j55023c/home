import { useQuery, useMutation } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export interface PropertyFilters {
  purpose?: string;
  type?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  search?: string;
}

export interface SupabaseProperty {
  id: string;
  title: string;
  purpose: string;
  type: string;
  price: number;
  city: string;
  neighborhood: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  description: string;
  images: string[];
  features: string[];
  featured: boolean;
  reference: string;
  createdAt: string;
  _raw?: {
    status: string;
    publicado: boolean;
    endereco: string | null;
    iptu: number | null;
    condominio: number | null;
    taxas: number | null;
    area_util: number | null;
    suites: number | null;
    ano_construcao: number | null;
    corretora_id: string;
    updated_at: string;
  };
}

export function useProperties(filters?: PropertyFilters) {
  return useQuery(orpc.properties.list.queryOptions({ input: filters ?? {} }));
}

export function useFeaturedProperties() {
  return useQuery(orpc.properties.featured.queryOptions());
}

export function useProperty(id: string) {
  return useQuery(orpc.properties.get.queryOptions({ input: { id }, staleTime: 30_000 }));
}

export function useCities() {
  return useQuery(orpc.properties.cities.queryOptions());
}

export function useCreateLead() {
  return useMutation(orpc.leads.create.mutationOptions());
}
