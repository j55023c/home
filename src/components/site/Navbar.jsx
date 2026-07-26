import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Coleção", href: "#colecao" },
  { label: "Manifesto", href: "#manifesto" },
  { label: "Curadoria", href: "#curadoria" },
  { label: "Contato", href: "#contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const dark = scrolled;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
        scrolled
          ? "glass-panel border-b border-border/60 py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 flex items-center justify-between">
        <a
          href="#topo"
          className={`font-heading text-2xl lg:text-[28px] leading-none tracking-tight transition-colors duration-700 ${
            dark ? "text-foreground" : "text-white"
          }`}
        >
          Home
          <span className="text-primary">.</span>
        </a>

        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`nav-underline text-[13px] font-medium tracking-[0.18em] uppercase transition-colors duration-500 ${
                dark ? "text-foreground/80 hover:text-foreground" : "text-white/85 hover:text-white"
              }`}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="#contato"
          className={`hidden md:inline-flex items-center text-[13px] font-medium tracking-[0.18em] uppercase border px-6 py-3 transition-all duration-500 ${
            dark
              ? "border-foreground/30 text-foreground hover:bg-foreground hover:text-background"
              : "border-white/40 text-white hover:bg-white hover:text-foreground"
          }`}
        >
          Agendar Visita
        </a>

        <button
          className={`md:hidden ${dark ? "text-foreground" : "text-white"}`}
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu size={26} strokeWidth={1.5} />
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-50 bg-background transition-all duration-500 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <span className="font-heading text-2xl">
            Home<span className="text-primary">.</span>
          </span>
          <button onClick={() => setOpen(false)} aria-label="Fechar menu">
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>
        <nav className="flex flex-col px-6 mt-8 gap-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="font-heading text-4xl py-3 border-b border-border"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setOpen(false)}
            className="mt-8 inline-flex justify-center items-center bg-foreground text-background text-[13px] font-medium tracking-[0.18em] uppercase px-6 py-4"
          >
            Agendar Visita
          </a>
        </nav>
      </div>
    </header>
  );
}