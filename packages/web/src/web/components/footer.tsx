import { Link } from "wouter";
import { Phone, Mail, MapPin, Instagram, Facebook } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#08080a] border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex flex-col leading-none mb-4">
            <span className="font-display text-2xl font-bold text-foreground">HOME</span>
            <span className="text-[0.6rem] tracking-luxe uppercase text-gold -mt-0.5">
              Negócios Imobiliários
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">
            Curadoria de imóveis de alto padrão com atendimento sob medida. Realizamos o encontro
            entre pessoas e endereços extraordinários.
          </p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/homeimobiliariatl"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors"
            >
              <Instagram size={16} />
            </a>
            <a
              href="https://facebook.com/profile.php?id=61566111946304"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors"
            >
              <Facebook size={16} />
            </a>
            <a
              href="https://wa.me/qr/6O66P4ZGUYPBI1"
              target="_blank"
              rel="noreferrer"
              className="w-9 h-9 border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-luxe text-gold mb-5">Navegação</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground transition-colors">Início</Link></li>
            <li><Link to="/imoveis" className="hover:text-foreground transition-colors">Imóveis</Link></li>
            <li><Link to="/sobre" className="hover:text-foreground transition-colors">Sobre</Link></li>
            <li><Link to="/contato" className="hover:text-foreground transition-colors">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-luxe text-gold mb-5">Imóveis</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/imoveis?purpose=venda" className="hover:text-foreground transition-colors">Para comprar</Link></li>
            <li><Link to="/imoveis?purpose=aluguel" className="hover:text-foreground transition-colors">Para alugar</Link></li>
            <li><Link to="/imoveis?type=cobertura" className="hover:text-foreground transition-colors">Coberturas</Link></li>
            <li><Link to="/imoveis?type=casa" className="hover:text-foreground transition-colors">Casas</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-luxe text-gold mb-5">Contato</h4>
          <ul className="space-y-4 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <Phone size={16} className="text-gold mt-0.5 shrink-0" />
              <a href="tel:+5567993488383" className="hover:text-foreground transition-colors">
                WhatsApp: (67) 99348-8383
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail size={16} className="text-gold mt-0.5 shrink-0" />
              <a href="mailto:homenegociosimobiliarios4@gmail.com" className="hover:text-foreground transition-colors">
                homenegociosimobiliarios4@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
              <span>Rua David Alexandria, 242 - Sala 02<br />Três Lagoas — MS</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Imobiliária Home Negócios Imobiliários Ltda. Todos os direitos reservados.</p>
          <p>CRECI 15986-J</p>
        </div>
      </div>
    </footer>
  );
}