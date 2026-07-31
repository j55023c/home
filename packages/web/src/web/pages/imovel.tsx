import { useState } from "react";
import { Link, useParams } from "wouter";
import {
  BedDouble, Bath, Car, Maximize, MapPin, Check, ArrowLeft,
  Phone, MessageCircle, ChevronLeft, ChevronRight, Mail,
} from "lucide-react";
import { Layout } from "../components/layout";
import { useProperty } from "../queries/properties";
import { formatPrice, PURPOSE_LABELS, TYPE_LABELS, whatsappLink, formatPhone } from "../lib/format";
import { ContactForm } from "../components/contact-form";
import { ImageWithWatermark } from "../components/ImageWithWatermark";

export default function ImovelPage() {
  const { id } = useParams<{ id: string }>();
  const { data: p, isLoading, isError } = useProperty(id);
  const [active, setActive] = useState(0);

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-40 pb-24 mx-auto max-w-7xl px-6 animate-pulse">
          <div className="h-[420px] bg-white/5 mb-8" />
          <div className="h-8 w-1/2 bg-white/5 mb-4" />
          <div className="h-4 w-1/3 bg-white/5" />
        </div>
      </Layout>
    );
  }

  if (isError || !p) {
    return (
      <Layout>
        <div className="pt-48 pb-32 text-center px-6">
          <h1 className="font-display text-3xl text-foreground mb-4">Imóvel não encontrado</h1>
          <Link to="/imoveis" className="text-gold uppercase text-sm tracking-[0.14em]">
            ← Voltar aos imóveis
          </Link>
        </div>
      </Layout>
    );
  }

  const images = p.images ?? [];
  const specs = [
    { icon: BedDouble, label: "Dormitórios", value: p.bedrooms },
    { icon: Bath, label: "Banheiros", value: p.bathrooms },
    { icon: Car, label: "Vagas", value: p.parking },
    { icon: Maximize, label: "Área", value: `${p.area} m²` },
  ].filter((s) => s.value !== 0);

  const waText = `Olá! Tenho interesse no imóvel ${p.reference} — ${p.title} (${formatPrice(p.price, p.purpose)}).`;

  return (
    <Layout>
      <section className="pt-32 bg-[#08080a]">
        <div className="mx-auto max-w-7xl px-6 pb-6">
          <Link
            to="/imoveis"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} /> Voltar aos imóveis
          </Link>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-[#08080a] pb-4">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-black">
            <ImageWithWatermark
              src={images[active]}
              alt={p.title}
              className="w-full h-full object-cover"
              watermarkSrc="/logo.jpg"
              watermarkOpacity={0.08}
              watermarkPosition="bottom-right"
              watermarkSize={12}
            />
            <span className="absolute top-5 left-5 bg-gold text-black text-xs uppercase tracking-[0.14em] px-3 py-1">
              {PURPOSE_LABELS[p.purpose]}
            </span>
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setActive((a) => (a - 1 + images.length) % images.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/50 border border-white/15 text-foreground flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => setActive((a) => (a + 1) % images.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-black/50 border border-white/15 text-foreground flex items-center justify-center hover:bg-gold hover:text-black transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-3 overflow-x-auto pb-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative shrink-0 w-28 h-20 overflow-hidden border ${
                    active === i ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
                  } transition-all`}
                >
                  <ImageWithWatermark
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                    watermarkSrc="/logo.jpg"
                    watermarkOpacity={0.06}
                    watermarkPosition="bottom-right"
                    watermarkSize={20}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="text-xs uppercase tracking-luxe text-muted-foreground mb-3 flex items-center gap-2">
              <MapPin size={14} className="text-gold" />
              {p.neighborhood} · {p.city} — {p.state}
            </p>
            <h1 className="font-display text-3xl md:text-4xl text-foreground leading-tight mb-2">
              {p.title}
            </h1>
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mb-6">
              {TYPE_LABELS[p.type]} · Ref. {p.reference}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border border border-border mb-10">
              {specs.map((s) => (
                <div key={s.label} className="bg-card p-5 text-center">
                  <s.icon size={22} className="text-gold mx-auto mb-2" strokeWidth={1.4} />
                  <p className="font-display text-xl text-foreground">{s.value}</p>
                  <p className="text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground mt-1">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>

            <h2 className="font-display text-2xl text-foreground mb-4">Sobre o imóvel</h2>
            <p className="text-muted-foreground leading-relaxed mb-10">{p.description}</p>

            {p.features?.length > 0 && (
              <>
                <h2 className="font-display text-2xl text-foreground mb-5">Diferenciais</h2>
                <ul className="grid sm:grid-cols-2 gap-3 mb-4">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-foreground/85">
                      <Check size={16} className="text-gold shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* Sticky contact */}
          <aside>
            <div className="sticky top-28 bg-card border border-border p-7">
              <p className="text-xs uppercase tracking-luxe text-muted-foreground mb-1">
                {p.purpose === "aluguel" ? "Valor do aluguel" : "Valor de venda"}
              </p>
              <p className="font-display text-3xl text-gradient-gold mb-6">
                {formatPrice(p.price, p.purpose)}
              </p>

              <a
                href={whatsappLink(waText)}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-gold text-black py-3.5 text-sm uppercase tracking-[0.14em] hover:bg-gold-soft transition-colors mb-3"
              >
                <MessageCircle size={17} /> WhatsApp
              </a>
              <a
                href={`tel:${p.corretora?.telefone || import.meta.env.VITE_WHATSAPP || '5567993488383'}`}
                className="flex items-center justify-center gap-2 w-full border border-gold text-gold py-3.5 text-sm uppercase tracking-[0.14em] hover:bg-gold hover:text-black transition-colors mb-7"
              >
                <Phone size={16} /> {p.corretora?.telefone ? formatPhone(p.corretora.telefone) : '(67) 99348-8383'}
              </a>

              {p.corretora && (
                <div className="border-t border-border pt-6 mb-6">
                  <p className="font-display text-lg text-foreground mb-4">Corretora responsável</p>
                  <div className="flex items-center gap-4">
                    {p.corretora.foto && (
                      <img
                        src={p.corretora.foto}
                        alt={p.corretora.nome}
                        className="w-16 h-16 rounded-full object-cover border border-border"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground truncate">{p.corretora.nome}</p>
                      {p.corretora.creci && (
                        <p className="text-xs text-muted-foreground">CRECI: {p.corretora.creci}</p>
                      )}
                      {p.corretora.email && (
                        <a href={`mailto:${p.corretora.email}`} className="text-xs text-gold hover:underline flex items-center gap-1 mt-1">
                          <Mail size={12} /> {p.corretora.email}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-border pt-6">
                <p className="font-display text-lg text-foreground mb-1">Agende uma visita</p>
                <p className="text-xs text-muted-foreground mb-5">
                  Deixe seus dados e um consultor entrará em contato.
                </p>
                <ContactForm compact propertyId={p.id} defaultMessage={waText} />
              </div>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}