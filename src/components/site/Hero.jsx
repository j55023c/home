import { useState } from "react";
import { Search, MapPin, ChevronDown } from "lucide-react";

const HERO_IMG =
  "https://media.base44.com/images/public/6a662586368b9e4abd258dea/1f7006066_generated_2694def8.png";

export default function Hero() {
  const [tipo, setTipo] = useState("Comprar");
  const [busca, setBusca] = useState("");

  return (
    <section id="topo" className="relative h-screen min-h-[680px] w-full overflow-hidden">
      <img
        src={HERO_IMG}
        alt="Detalhe arquitetônico banhado pela luz do entardecer"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/55" />

      {/* Headline */}
      <div className="relative z-10 flex flex-col justify-end h-full mx-auto max-w-[1400px] px-6 lg:px-12 pb-[28vh]">
        <p className="text-white/70 text-[12px] tracking-[0.3em] uppercase mb-5 animate-fade-in">
          Curadoria de Estilo de Vida
        </p>
        <h1 className="font-heading text-white text-[44px] sm:text-[64px] lg:text-[88px] leading-[0.95] max-w-4xl text-balance animate-fade-slide-up">
          A geometria do
          <span className="block italic font-light">pertencimento.</span>
        </h1>
      </div>

      {/* Glass search bar */}
      <div className="absolute bottom-10 inset-x-0 z-20 px-6 lg:px-12">
        <div className="mx-auto max-w-[1100px] glass-panel rounded-none border border-white/30 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.4)] animate-fade-slide-up">
          <div className="flex flex-col md:flex-row">
            {/* Tabs */}
            <div className="flex items-center gap-1 p-3 md:border-r border-white/20">
              {["Comprar", "Alugar", "Lançamentos"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`px-4 py-2 text-[12px] tracking-[0.14em] uppercase transition-colors duration-300 ${
                    tipo === t
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="flex-1 flex items-center gap-3 px-5 py-4">
              <MapPin size={18} className="text-primary" strokeWidth={1.5} />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Onde você deseja pertencer?"
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-foreground/45 text-[15px]"
              />
            </div>

            {/* Type selector */}
            <div className="relative flex items-center px-5 md:border-l border-white/20">
              <select className="appearance-none bg-transparent outline-none text-foreground/80 text-[13px] tracking-[0.08em] pr-6 py-4 cursor-pointer">
                <option>Todos os tipos</option>
                <option>Casas</option>
                <option>Apartamentos</option>
                <option>Coberturas</option>
                <option>Terrenos</option>
              </select>
              <ChevronDown
                size={15}
                className="absolute right-5 text-foreground/60 pointer-events-none"
                strokeWidth={1.5}
              />
            </div>

            {/* Submit */}
            <button className="group flex items-center justify-center gap-3 bg-foreground text-background px-8 py-5 hover:bg-primary hover:text-primary-foreground transition-colors duration-500">
              <Search size={18} strokeWidth={1.5} />
              <span className="text-[12px] tracking-[0.18em] uppercase">Buscar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-2 z-10 hidden lg:block">
        <div className="h-12 w-px bg-white/40 animate-pulse" />
      </div>
    </section>
  );
}