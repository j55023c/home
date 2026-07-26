import { ArrowRight } from "lucide-react";
import PropertyCard, { PROPERTIES } from "./PropertyCard";
import { useReveal } from "@/hooks/useReveal";

export default function PropertyGallery() {
  const headRef = useReveal();

  return (
    <section id="colecao" className="bg-background py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        {/* Section header */}
        <div ref={headRef} className="reveal flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14 lg:mb-20">
          <div className="max-w-2xl">
            <p className="text-primary text-[12px] tracking-[0.28em] uppercase mb-4">
              A Galeria de Curadoria
            </p>
            <h2 className="font-heading text-4xl lg:text-6xl leading-[1.02] text-balance">
              Imóveis como peças
              <span className="block italic font-light">de uma coleção.</span>
            </h2>
          </div>
          <p className="max-w-sm text-foreground/65 text-[15px] leading-relaxed">
            Cada endereço é selecionado pela luz que recebe, pela proporção que
            organiza o espaço e pelo silêncio que ele oferece. Não vendemos
            metros — curamos pertencimento.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {PROPERTIES.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 lg:mt-24 flex justify-center">
          <a
            href="#contato"
            className="group inline-flex items-center gap-3 border border-foreground/25 px-8 py-4 text-[12px] tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors duration-500"
          >
            Ver coleção completa
            <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}