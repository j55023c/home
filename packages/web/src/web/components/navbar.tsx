import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";

const LINKS = [
  { href: "/", label: "Início" },
  { href: "/imoveis", label: "Imóveis" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const solid = scrolled || location !== "/";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        solid
          ? "bg-[#0b0b0c]/90 backdrop-blur-md border-b border-border py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-none group">
          <span className="font-display text-2xl font-bold tracking-wide text-foreground">
            HOME
          </span>
          <span className="text-[0.6rem] tracking-luxe uppercase text-gold -mt-0.5">
            Negócios Imobiliários
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {LINKS.map((l) => {
            const active = location === l.href;
            return (
              <Link
                key={l.href}
                to={l.href}
                className={`text-sm uppercase tracking-[0.14em] transition-colors relative py-1 ${
                  active ? "text-gold" : "text-foreground/80 hover:text-gold"
                }`}
              >
                {l.label}
                {active && (
                  <span className="absolute -bottom-0.5 left-0 w-full h-px bg-gold" />
                )}
              </Link>
            );
          })}
        </nav>

        <Link
          to="/contato"
          className="hidden md:inline-flex items-center border border-gold text-gold px-6 py-2.5 text-xs uppercase tracking-[0.16em] hover:bg-gold hover:text-black transition-all duration-300"
        >
          Fale Conosco
        </Link>

        <button
          className="md:hidden text-foreground p-1"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#0b0b0c]/98 border-t border-border mt-3">
          <nav className="flex flex-col px-6 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                to={l.href}
                className="py-3 text-sm uppercase tracking-[0.14em] text-foreground/80 hover:text-gold border-b border-border/50 last:border-0"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
