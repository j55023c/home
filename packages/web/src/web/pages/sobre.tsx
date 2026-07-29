import { Link } from "wouter";
import { motion } from "motion/react";
import { Target, Eye, Heart, ArrowRight } from "lucide-react";
import { Layout } from "../components/layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const VALUES = [
  { icon: Target, title: "Missão", text: "Conectar pessoas a imóveis que traduzem seus sonhos e projetos de vida, com transparência e excelência em cada etapa." },
  { icon: Eye, title: "Visão", text: "Ser a referência em intermediação de imóveis de alto padrão, reconhecida pela confiança e pelo cuidado com cada cliente." },
  { icon: Heart, title: "Valores", text: "Ética, discrição, atendimento personalizado e compromisso genuíno com o resultado de quem confia na Home." },
];

const TEAM = [
  { name: "Ricardo Almeida", role: "Diretor & Corretor", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80" },
  { name: "Beatriz Costa", role: "Consultora Sênior", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80" },
  { name: "Fernando Lima", role: "Consultor de Investimentos", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80" },
  { name: "Carolina Nunes", role: "Relacionamento", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80" },
];

export default function SobrePage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-48 pb-28 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=2000&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="relative mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-luxe text-gold mb-5">Quem somos</p>
          <h1 className="font-display text-4xl md:text-6xl text-foreground max-w-3xl leading-tight">
            Uma imobiliária feita de <span className="text-gradient-gold italic">relações</span>, não de anúncios.
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6 grid gap-14 lg:grid-cols-2 items-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-xs uppercase tracking-luxe text-gold mb-4">Nossa história</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
              Há 18 anos realizando bons negócios
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                A Home Negócios Imobiliários nasceu da convicção de que comprar, vender ou alugar um
                imóvel é uma das decisões mais importantes na vida de uma pessoa — e merece um
                acompanhamento à altura.
              </p>
              <p>
                Construímos ao longo dos anos um portfólio criterioso de residências, coberturas e
                propriedades singulares, sempre com o mesmo compromisso: entender de verdade quem
                está do outro lado e cuidar de cada detalhe da negociação.
              </p>
              <p>
                Mais do que fechar contratos, entregamos chaves de novos capítulos.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            custom={1}
            variants={fadeUp}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80"
              alt="Interior de alto padrão"
              className="w-full aspect-[4/5] object-cover"
            />
            <div className="absolute -bottom-6 -left-6 bg-gold text-black p-6 hidden md:block">
              <p className="font-display text-3xl">18+</p>
              <p className="text-xs uppercase tracking-[0.14em]">anos de mercado</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-[#08080a] border-y border-border">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-px bg-border md:grid-cols-3 border border-border">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="bg-background p-10"
              >
                <v.icon size={30} className="text-gold mb-6" strokeWidth={1.3} />
                <h3 className="font-display text-2xl text-foreground mb-3">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-luxe text-gold mb-4">Nossa equipe</p>
            <h2 className="font-display text-4xl text-foreground">Consultores que fazem a diferença</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((m, i) => (
              <motion.div
                key={m.name}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}
                variants={fadeUp}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-4 border border-border">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <h3 className="font-display text-lg text-foreground">{m.name}</h3>
                <p className="text-xs uppercase tracking-[0.14em] text-gold mt-1">{m.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#08080a] border-t border-border text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-3xl md:text-4xl text-foreground mb-6">
            Vamos encontrar o seu próximo imóvel juntos?
          </h2>
          <Link
            to="/contato"
            className="inline-flex items-center gap-2 bg-gold text-black px-9 py-4 text-sm uppercase tracking-[0.16em] hover:bg-gold-soft transition-colors"
          >
            Fale conosco <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
