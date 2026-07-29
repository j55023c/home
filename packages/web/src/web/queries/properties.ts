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

export function useProperties(filters?: PropertyFilters) {
  return useQuery(orpc.properties.list.queryOptions({ input: filters ?? {} }));
}

export function useFeaturedProperties() {
  return useQuery(orpc.properties.featured.queryOptions());
}

export function useProperty(id: number) {
  return useQuery(orpc.properties.get.queryOptions({ input: { id }, staleTime: 30_000 }));
}

export function useCities() {
  return useQuery(orpc.properties.cities.queryOptions());
}

export function useCreateLead() {
  return useMutation(orpc.leads.create.mutationOptions());
}
