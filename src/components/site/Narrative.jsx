import { useReveal } from "@/hooks/useReveal";

const MANIFESTO_IMG =
  "https://media.base44.com/images/public/6a662586368b9e4abd258dea/326317621_generated_d6b1c81e.png";

const PILLARS = [
  {
    n: "01",
    titulo: "Luz",
    texto:
      "Priorizamos imóveis onde a luz natural desenha o dia. A orientação solar é o primeiro critério de seleção — antes do preço, antes do bairro.",
  },
  {
    n: "02",
    titulo: "Proporção",
    texto:
      "Acreditamos que o conforto nasce da escala correta. Pé-direito generoso, fluxos que respiram e ambientes que convidam ao permanecer.",
  },
  {
    n: "03",
    titulo: "Solidez",
    texto:
      "Materiais nobres, execução impecável e patrimônio que atravessa ciclos. Um lar da Home é, antes de tudo, uma decisão segura.",
  },
];

export default function Narrative() {
  const imgRef = useReveal();
  const textRef = useReveal();

  return (
    <section id="manifesto" className="bg-foreground text-background py-24 lg:py-40 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Image — overlaps the grid */}
          <div ref={imgRef} className="reveal lg:col-span-6 lg:-ml-6">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={MANIFESTO_IMG}
                alt="Detalhe de texturas: madeira, concreto e vidro"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          </div>

          {/* Text */}
          <div ref={textRef} className="reveal lg:col-span-6 lg:pl-8">
            <p className="text-primary-foreground/60 text-[12px] tracking-[0.28em] uppercase mb-6">
              Manifesto
            </p>
            <h2 className="font-heading text-4xl lg:text-[58px] leading-[1.05] mb-8 text-balance">
              Não vendemos imóveis.
              <span className="block italic font-light text-primary-foreground/90">
                Arquitetamos pertencimento.
              </span>
            </h2>
            <p className="text-background/70 text-[16px] leading-relaxed mb-12 max-w-lg">
              A Home Negócios Imobiliários transcende a transação para oferecer
              um ecossistema de curadoria de estilo de vida. Cada seleção é uma
              conversa entre luz, proporção e solidez — o ponto onde uma casa
              se torna um lar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {PILLARS.map((p) => (
                <div key={p.n} className="border-t border-background/15 pt-5">
                  <span className="block font-heading text-primary-foreground text-2xl mb-3">
                    {p.n}
                  </span>
                  <h3 className="font-heading text-xl mb-3">{p.titulo}</h3>
                  <p className="text-background/55 text-[14px] leading-relaxed">
                    {p.texto}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}