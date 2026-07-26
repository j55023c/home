import { Instagram, Facebook, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-5">
            <span className="font-heading text-3xl">
              Home<span className="text-primary">.</span>
            </span>
            <p className="mt-5 text-background/55 text-[14px] leading-relaxed max-w-xs">
              Curadoria de estilo de vida. Imóveis selecionados com olhar
              arquitetônico, onde luz, proporção e pertencimento se encontram.
            </p>
            <div className="flex items-center gap-4 mt-7">
              {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-background/60 hover:text-primary transition-colors duration-300"
                  aria-label="Rede social"
                >
                  <Icon size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div className="md:col-span-3">
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-primary-foreground/60 mb-5">
              Navegação
            </h4>
            <ul className="space-y-3 text-[14px]">
              {[
                { l: "Coleção", h: "#colecao" },
                { l: "Manifesto", h: "#manifesto" },
                { l: "Curadoria", h: "#curadoria" },
                { l: "Contato", h: "#contato" },
              ].map((i) => (
                <li key={i.h}>
                  <a href={i.h} className="text-background/70 hover:text-background transition-colors">
                    {i.l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h4 className="text-[11px] tracking-[0.2em] uppercase text-primary-foreground/60 mb-5">
              Atendimento
            </h4>
            <ul className="space-y-3 text-[14px] text-background/70">
              <li>Rua Comendador Araújo, 499 — Batel, Curitiba/PR</li>
              <li>(41) 3333-4400 · 98800-4400</li>
              <li>contato@homeimoveis.com.br</li>
              <li className="pt-2 text-background/45">Seg–Sáb · 9h às 19h</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-background/15 flex flex-col md:flex-row justify-between gap-4 text-[12px] text-background/45">
          <span>© {new Date().getFullYear()} Home Negócios Imobiliários. CRECI-PR 012.345.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-background transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-background transition-colors">Termos</a>
          </div>
        </div>
      </div>
    </footer>
  );
}