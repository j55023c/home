import { Compass, Handshake, KeyRound, TrendingUp } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const SERVICES = [
  {
    icon: Compass,
    titulo: "Curadoria Personalizada",
    texto:
      "Entendemos seu estilo de vida antes do endereço. Buscamos imóveis que traduzem sua identidade — não os que apenas cabem no orçamento.",
  },
  {
    icon: TrendingUp,
    titulo: "Avaliação Patrimonial",
    texto:
      "Análise precisa de mercado para vender ou investir. Olhar técnico sobre valor de aquisição, liquidez e potencial de valorização.",
  },
  {
    icon: Handshake,
    titulo: "Assessoria de Negociação",
    texto:
      "Conduzimos cada etapa com discrição e firmeza. Da proposta à escritura, você é representado por especialistas que protegem seu interesse.",
  },
  {
    icon: KeyRound,
    titulo: "Pós-venda Integral",
    texto:
      "O acompanhamento não termina na entrega das chaves. Regularização, documentação e concierge imobiliário continuam ao seu lado.",
  },
];

export default function Services() {
  const ref = useReveal();
  return (
    <section id="curadoria" className="bg-background py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div ref={ref} className="reveal max-w-2xl mb-14 lg:mb-20">
          <p className="text-primary text-[12px] tracking-[0.28em] uppercase mb-4">
            Curadoria
          </p>
          <h2 className="font-heading text-4xl lg:text-6xl leading-[1.02] text-balance">
            Um serviço desenhado
            <span className="block italic font-light">para cada jornada.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-border">
          {SERVICES.map((s) => (
            <ServiceItem key={s.titulo} service={s} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceItem({ service }) {
  const ref = useReveal();
  const Icon = service.icon;
  return (
    <div
      ref={ref}
      className="reveal group border-b border-border lg:border-r last:lg:border-r-0 sm:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r py-10 px-6 lg:px-8 transition-colors duration-500 hover:bg-secondary/40"
    >
      <Icon
        size={32}
        strokeWidth={1.25}
        className="text-primary mb-6 transition-transform duration-500 group-hover:-translate-y-1"
      />
      <h3 className="font-heading text-2xl mb-3">{service.titulo}</h3>
      <p className="text-foreground/60 text-[14px] leading-relaxed max-w-xs">
        {service.texto}
      </p>
    </div>
  );
}