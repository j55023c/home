import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { Layout } from "../components/layout";
import { ContactForm } from "../components/contact-form";
import { whatsappLink } from "../lib/format";

const INFO = [
  { icon: Phone, label: "Telefone", value: "(67) 99348-8383", href: "tel:+5567993488383" },
  { icon: Mail, label: "E-mail", value: "homenegociosimobiliarios4@gmail.com", href: "mailto:homenegociosimobiliarios4@gmail.com" },
  { icon: MapPin, label: "Endereço", value: "Rua David Alexandria, 242 - Sala 02, Três Lagoas/MS" },
  { icon: Clock, label: "Horário", value: "Seg a Sex: 8h–18h · Sáb: 8h–12h" },
];

export default function ContatoPage() {
  return (
    <Layout>
      <section className="pt-40 pb-16 bg-[#08080a] border-b border-border">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-xs uppercase tracking-luxe text-gold mb-4">Fale conosco</p>
          <h1 className="font-display text-4xl md:text-5xl text-foreground max-w-2xl">
            Estamos prontos para atender você
          </h1>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl text-foreground mb-2">Envie sua mensagem</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Preencha o formulário e um de nossos consultores retornará o mais breve possível.
            </p>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <div className="grid sm:grid-cols-2 gap-px bg-border border border-border">
              {INFO.map((i) => {
                const content = (
                  <>
                    <i.icon size={22} className="text-gold mb-4" strokeWidth={1.4} />
                    <p className="text-[0.65rem] uppercase tracking-luxe text-muted-foreground mb-1">
                      {i.label}
                    </p>
                    <p className="text-sm text-foreground/90 leading-relaxed">{i.value}</p>
                  </>
                );
                return i.href ? (
                  <a key={i.label} href={i.href} className="bg-card p-7 hover:bg-accent transition-colors block">
                    {content}
                  </a>
                ) : (
                  <div key={i.label} className="bg-card p-7">{content}</div>
                );
              })}
            </div>

            <a
              href={whatsappLink("Olá, vim pelo site e gostaria de mais informações.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gold text-black py-4 text-sm uppercase tracking-[0.16em] hover:bg-gold-soft transition-colors"
            >
              <MessageCircle size={18} /> Conversar no WhatsApp
            </a>

            <div className="border border-border overflow-hidden">
              <iframe
                title="Localização da Home Negócios Imobiliários"
                src="https://www.google.com/maps?q=Rua+David+Alexandria+242+Sala+02+Tr%C3%AAs+Lagoas+MS&output=embed"
                className="w-full h-[280px] grayscale contrast-125"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}