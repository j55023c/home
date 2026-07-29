import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "motion/react";
import { Search, ShieldCheck, Gem, Handshake, Key, ArrowRight } from "lucide-react";
import { Layout } from "../components/layout";
import { PropertyCard } from "../components/property-card";
import { useFeaturedProperties } from "../queries/properties";

const HERO_IMG =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function Hero() {
  const [, navigate] = useLocation();
  const [purpose, setPurpose] = useState("");
  const [type, setType] = useState("");
  const [search, setSearch] = useState("");

  function submit() {
    const params = new URLSearchParams();
    if (purpose) params.set("purpose", purpose);
    if (type) params.set("type", type);
    if (search) params.set("search", search);
    navigate(`/imoveis${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-[#0b0b0c]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 w-full pt-28">
        <motion.p
          initial="hidden"
          animate="show"
          custom={0}
          variants={fadeUp}
          className="text-xs uppercase tracking-luxe text-gold mb-6"
        >
          Imobiliária em Três Lagoas — MS
        </motion.p>
        <motion.h1
          initial="hidden"
          animate="show"
          custom={1}
          variants={fadeUp}
          className="font-display text-5xl md:text-7xl font-semibold text-foreground leading-[1.05] max-w-4xl"
        >
          Encontramos o endereço à altura da sua{" "}
          <span className="text-gradient-gold italic">história.</span>
        </motion.h1>
        <motion.p
          initial="hidden"
          animate="show"
          custom={2}
          variants={fadeUp}
          className="mt-6 text-lg text-foreground/70 max-w-xl leading-relaxed"
        >
          A Home Imobiliária iniciou suas atividades visando construir a sua história no mercado
          imobiliário de Três Lagoas, de forma sólida, confiável e duradoura. Ética, transparência
          e atendimento personalizado.
        </motion.p>

        <motion.div
          initial="hidden"
          animate="show"
          custom={3}
          variants={fadeUp}
          className="mt-10 bg-[#0b0b0c]/80 backdrop-blur-md border border-border p-4 max-w-4xl"
        >
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.4fr_auto]">
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="bg-transparent border border-border px-4 py-3 text-sm text-foreground focus:border-gold outline-none"
            >
              <option value="" className="bg-[#141416]">Finalidade</option>
              <option value="venda" className="bg-[#141416]">Comprar</option>
              <option value="aluguel" className="bg-[#141416]">Alugar</option>
            </select>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="bg-transparent border border-border px-4 py-3 text-sm text-foreground focus:border-gold outline-none"
            >
              <option value="" className="bg-[#141416]">Tipo</option>
              <option value="casa" className="bg-[#141416]">Casa</option>
              <option value="apartamento" className="bg-[#141416]">Apartamento</option>
              <option value="cobertura" className="bg-[#141416]">Cobertura</option>
              <option value="terreno" className="bg-[#141416]">Terreno</option>
              <option value="comercial" className="bg-[#141416]">Comercial</option>
            </select>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Bairro ou cidade"
              className="bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold outline-none"
            />
            <button
              onClick={submit}
              className="flex items-center justify-center gap-2 bg-gold text-black px-6 py-3 text-sm uppercase tracking-[0.14em] hover:bg-gold-soft transition-colors"
            >
              <Search size={16} /> Buscar
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Featured() {
  const { data, isLoading } = useFeaturedProperties();
  return (
    <section className="py-28 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="text-xs uppercase tracking-luxe text-gold mb-4">Seleção especial</p>
            <h2 className="font-display text-4xl md:text-5xl text-foreground">
              Imóveis em destaque
            </h2>
          </div>
          <Link
            to="/imoveis"
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.14em] text-gold hover:gap-3 transition-all"
          >
            Ver todos os imóveis <ArrowRight size={16} />
          </Link>
        </Reveal>

        {isLoading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card border border-border animate-pulse">
                <div className="aspect-[4/3] bg-white/5" />
                <div className="p-6 space-y-3">
                  <div className="h-3 w-1/3 bg-white/5" />
                  <div className="h-5 w-3/4 bg-white/5" />
                  <div className="h-4 w-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data?.map((p, i) => (
              <motion.div
                key={p.id}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
                custom={i % 3}
                variants={fadeUp}
              >
                <PropertyCard property={p} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

const DIFFERENTIALS = [
  { icon: Gem, title: "Portfólio exclusivo", text: "Imóveis selecionados a dedo, muitos deles fora do mercado aberto." },
  { icon: ShieldCheck, title: "Segurança jurídica", text: "Assessoria completa em toda a documentação e nas negociações." },
  { icon: Handshake, title: "Atendimento sob medida", text: "Um consultor dedicado do primeiro contato à entrega das chaves." },
  { icon: Key, title: "Negociação inteligente", text: "Avaliação precisa e estratégia para o melhor negócio possível." },
];

function Differentials() {
  return (
    <section className="py-28 bg-[#08080a] border-y border-border">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-luxe text-gold mb-4">Por que a Home</p>
          <h2 className="font-display text-4xl md:text-5xl text-foreground">
            Excelência em cada detalhe
          </h2>
        </Reveal>
        <div className="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4 border border-border">
          {DIFFERENTIALS.map((d, i) => (
            <motion.div
              key={d.title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
              variants={fadeUp}
              className="bg-background p-8 group hover:bg-card transition-colors"
            >
              <d.icon size={30} className="text-gold mb-6" strokeWidth={1.3} />
              <h3 className="font-display text-xl text-foreground mb-3">{d.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{d.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: "Há anos", label: "No mercado imobiliário de Três Lagoas" },
    { value: "100+", label: "Imóveis em carteira" },
    { value: "Famílias", label: "Atendidas com segurança" },
    { value: "Ética", label: "E transparência sempre" },
  ];
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6 grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-6 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={i}
            variants={fadeUp}
          >
            <p className="font-display text-4xl md:text-5xl text-gradient-gold mb-2">{s.value}</p>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/75" />
      <Reveal className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="text-xs uppercase tracking-luxe text-gold mb-5">Vamos conversar</p>
        <h2 className="font-display text-4xl md:text-5xl text-foreground leading-tight mb-6">
          Pronto para encontrar o seu próximo endereço?
        </h2>
        <p className="text-foreground/70 mb-10 max-w-xl mx-auto">
          Conte para nós o que você procura. Nossa equipe preparará uma seleção personalizada de
          imóveis para você.
        </p>
        <Link
          to="/contato"
          className="inline-flex items-center gap-2 bg-gold text-black px-9 py-4 text-sm uppercase tracking-[0.16em] hover:bg-gold-soft transition-colors"
        >
          Falar com um consultor <ArrowRight size={16} />
        </Link>
      </Reveal>
    </section>
  );
}

export default function Index() {
  return (
    <Layout>
      <Hero />
      <Featured />
      <Differentials />
      <Stats />
      <CTA />
    </Layout>
  );
}