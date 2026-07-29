import { useEffect, useMemo, useState } from "react";
import { useSearch } from "wouter";
import { SlidersHorizontal, X } from "lucide-react";
import { Layout } from "../components/layout";
import { PropertyCard } from "../components/property-card";
import { useProperties, useCities, type PropertyFilters } from "../queries/properties";

const PRICE_STEPS = [
  { label: "Qualquer valor", min: undefined, max: undefined },
  { label: "Até R$ 1 mi", min: undefined, max: 1000000 },
  { label: "R$ 1 mi – 3 mi", min: 1000000, max: 3000000 },
  { label: "R$ 3 mi – 5 mi", min: 3000000, max: 5000000 },
  { label: "Acima de R$ 5 mi", min: 5000000, max: undefined },
];

export default function ImoveisPage() {
  const searchString = useSearch();
  const params = useMemo(() => new URLSearchParams(searchString), [searchString]);

  const [purpose, setPurpose] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [priceIdx, setPriceIdx] = useState(0);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setPurpose(params.get("purpose") ?? "");
    setType(params.get("type") ?? "");
    setSearch(params.get("search") ?? "");
    setCity(params.get("city") ?? "");
  }, [params]);

  const { data: cities } = useCities();

  const filters: PropertyFilters = {
    purpose: purpose || undefined,
    type: type || undefined,
    city: city || undefined,
    bedrooms: bedrooms ? Number(bedrooms) : undefined,
    minPrice: PRICE_STEPS[priceIdx].min,
    maxPrice: PRICE_STEPS[priceIdx].max,
    search: search || undefined,
  };

  const { data, isLoading } = useProperties(filters);

  function clearAll() {
    setPurpose("");
    setType("");
    setCity("");
    setBedrooms("");
    setPriceIdx(0);
    setSearch("");
  }

  const hasFilters = purpose || type || city || bedrooms || priceIdx > 0 || search;

  const selectCls =
    "w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground focus:border-gold outline-none";

  const FilterControls = (
    <div className="grid gap-5">
      <div>
        <label className="block text-[0.65rem] uppercase tracking-luxe text-muted-foreground mb-2">
          Buscar
        </label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Bairro, cidade, título…"
          className={selectCls}
        />
      </div>
      <div>
        <label className="block text-[0.65rem] uppercase tracking-luxe text-muted-foreground mb-2">
          Finalidade
        </label>
        <select value={purpose} onChange={(e) => setPurpose(e.target.value)} className={selectCls}>
          <option value="" className="bg-[#141416]">Todas</option>
          <option value="venda" className="bg-[#141416]">Comprar</option>
          <option value="aluguel" className="bg-[#141416]">Alugar</option>
        </select>
      </div>
      <div>
        <label className="block text-[0.65rem] uppercase tracking-luxe text-muted-foreground mb-2">
          Tipo
        </label>
        <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
          <option value="" className="bg-[#141416]">Todos</option>
          <option value="casa" className="bg-[#141416]">Casa</option>
          <option value="apartamento" className="bg-[#141416]">Apartamento</option>
          <option value="cobertura" className="bg-[#141416]">Cobertura</option>
          <option value="terreno" className="bg-[#141416]">Terreno</option>
          <option value="comercial" className="bg-[#141416]">Comercial</option>
        </select>
      </div>
      <div>
        <label className="block text-[0.65rem] uppercase tracking-luxe text-muted-foreground mb-2">
          Cidade
        </label>
        <select value={city} onChange={(e) => setCity(e.target.value)} className={selectCls}>
          <option value="" className="bg-[#141416]">Todas</option>
          {cities?.map((c) => (
            <option key={c} value={c} className="bg-[#141416]">{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-[0.65rem] uppercase tracking-luxe text-muted-foreground mb-2">
          Dormitórios (mín.)
        </label>
        <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className={selectCls}>
          <option value="" className="bg-[#141416]">Indiferente</option>
          <option value="1" className="bg-[#141416]">1+</option>
          <option value="2" className="bg-[#141416]">2+</option>
          <option value="3" className="bg-[#141416]">3+</option>
          <option value="4" className="bg-[#141416]">4+</option>
        </select>
      </div>
      <div>
        <label className="block text-[0.65rem] uppercase tracking-luxe text-muted-foreground mb-2">
          Faixa de preço
        </label>
        <select
          value={priceIdx}
          onChange={(e) => setPriceIdx(Number(e.target.value))}
          className={selectCls}
        >
          {PRICE_STEPS.map((p, i) => (
            <option key={p.label} value={i} className="bg-[#141416]">{p.label}</option>
          ))}
        </select>
      </div>
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center justify-center gap-2 border border-border py-3 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-gold hover:border-gold transition-colors"
        >
          <X size={14} /> Limpar filtros
        </button>
      )}
    </div>
  );

  return (
    <Layout>
      <section className="pt-40 pb-16 bg-[#08080a] border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-luxe text-gold mb-4">Nosso portfólio</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground">Imóveis disponíveis</h1>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-6 grid gap-10 lg:grid-cols-[300px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-28 bg-card border border-border p-6">
              <h2 className="font-display text-lg text-foreground mb-6 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-gold" /> Filtros
              </h2>
              {FilterControls}
            </div>
          </aside>

          <div>
            <div className="flex items-center justify-between mb-8">
              <p className="text-sm text-muted-foreground">
                {isLoading ? "Carregando…" : `${data?.length ?? 0} imóveis encontrados`}
              </p>
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 border border-gold text-gold px-4 py-2 text-xs uppercase tracking-[0.14em]"
              >
                <SlidersHorizontal size={14} /> Filtros
              </button>
            </div>

            {isLoading ? (
              <div className="grid gap-8 md:grid-cols-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border border-border animate-pulse">
                    <div className="aspect-[4/3] bg-white/5" />
                    <div className="p-6 space-y-3">
                      <div className="h-3 w-1/3 bg-white/5" />
                      <div className="h-5 w-3/4 bg-white/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : data && data.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2">
                {data.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <div className="border border-border bg-card p-16 text-center">
                <p className="font-display text-2xl text-foreground mb-3">Nenhum imóvel encontrado</p>
                <p className="text-muted-foreground mb-6">
                  Ajuste os filtros ou fale conosco — temos oportunidades fora do site.
                </p>
                <button
                  onClick={clearAll}
                  className="border border-gold text-gold px-6 py-3 text-xs uppercase tracking-[0.14em] hover:bg-gold hover:text-black transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-black/70" onClick={() => setShowFilters(false)}>
          <div
            className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[#0b0b0c] border-l border-border p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg text-foreground">Filtros</h2>
              <button onClick={() => setShowFilters(false)} className="text-foreground">
                <X size={22} />
              </button>
            </div>
            {FilterControls}
            <button
              onClick={() => setShowFilters(false)}
              className="w-full mt-6 bg-gold text-black py-3 text-xs uppercase tracking-[0.16em]"
            >
              Ver resultados
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}
