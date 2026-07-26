import { Image as ImageIcon } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const PROPERTIES = [
  {
    id: 1,
    titulo: "Reserva Jardim Botânico",
    local: "Jardim Botânico, Curitiba",
    preco: "R$ 4.850.000",
    tipo: "Casa de Alto Padrão",
    area: "420 m²",
    quartos: 4,
    vagas: 4,
    destaque: true,
    span: "lg:col-span-7",
    img: "https://media.base44.com/images/public/6a662586368b9e4abd258dea/8a02e7313_generated_1f02ebe8.png",
  },
  {
    id: 2,
    titulo: "Cobertura Aurora",
    local: "Batel, Curitiba",
    preco: "R$ 6.200.000",
    tipo: "Cobertura Duplex",
    area: "310 m²",
    quartos: 3,
    vagas: 3,
    destaque: true,
    span: "lg:col-span-5",
    img: "https://media.base44.com/images/public/6a662586368b9e4abd258dea/c70eaf8ef_generated_2235f14b.png",
  },
  {
    id: 3,
    titulo: "Loft Petróvich",
    local: "São Francisco, Curitiba",
    preco: "R$ 2.380.000",
    tipo: "Apartamento",
    area: "180 m²",
    quartos: 3,
    vagas: 2,
    span: "lg:col-span-5",
    img: "https://media.base44.com/images/public/6a662586368b9e4abd258dea/55a006ef2_generated_2e487cfa.png",
  },
  {
    id: 4,
    titulo: "Casa Serenidade",
    local: "Alphaville, São José dos Pinhais",
    preco: "R$ 3.650.000",
    tipo: "Casa em Condomínio",
    area: "360 m²",
    quartos: 4,
    vagas: 3,
    span: "lg:col-span-7",
    img: "https://media.base44.com/images/public/6a662586368b9e4abd258dea/624dacfb2_generated_7c8d1a13.png",
  },
];

function Spec({ children }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-foreground/60 tracking-wide">
      {children}
    </span>
  );
}

export default function PropertyCard({ property }) {
  const ref = useReveal();
  const p = property;
  const h = p.destaque ? "h-[460px] md:h-[560px]" : "h-[420px] md:h-[480px]";

  return (
    <article
      ref={ref}
      className={`property-card reveal relative overflow-hidden group cursor-pointer ${p.span ?? "lg:col-span-6"} ${h}`}
    >
      <img
        src={p.img}
        alt={`${p.titulo} — ${p.local}`}
        className="property-card-image absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Top label */}
      <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
        <span className="glass-panel-dark text-white text-[11px] tracking-[0.2em] uppercase px-4 py-2">
          {p.tipo}
        </span>
        <span className="property-card-price glass-panel-dark text-white text-[15px] font-heading tracking-wide px-4 py-2">
          {p.preco}
        </span>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 inset-x-0 p-6 lg:p-8 text-white">
        <p className="text-white/70 text-[11px] tracking-[0.24em] uppercase mb-2">{p.local}</p>
        <h3 className="font-heading text-3xl lg:text-[34px] leading-tight mb-4">{p.titulo}</h3>
        <div className="flex flex-wrap items-center gap-5 text-white/75">
          <Spec><ImageIcon size={14} strokeWidth={1.5} /> {p.area}</Spec>
          <Spec>{p.quartos} quartos</Spec>
          <Spec>{p.vagas} vagas</Spec>
        </div>
      </div>
    </article>
  );
}

export { PROPERTIES };