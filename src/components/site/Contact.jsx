import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export default function Contact() {
  const ref = useReveal();
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", mensagem: "" });
  const [enviado, setEnviado] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setEnviado(true);
  };

  const field =
    "w-full bg-transparent border-b border-border py-3 outline-none focus:border-primary transition-colors duration-300 text-[15px] placeholder:text-foreground/40";

  return (
    <section id="contato" className="bg-secondary/50 py-24 lg:py-36">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div ref={ref} className="reveal grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — invitation */}
          <div>
            <p className="text-primary text-[12px] tracking-[0.28em] uppercase mb-4">
              Agende uma visita
            </p>
            <h2 className="font-heading text-4xl lg:text-6xl leading-[1.02] mb-8 text-balance">
              Sua próxima morada
              <span className="block italic font-light">começa com uma conversa.</span>
            </h2>
            <p className="text-foreground/65 text-[16px] leading-relaxed mb-10 max-w-md">
              Conte-nos sobre o estilo de vida que você busca. Nossa curadoria
              encontra o imóvel que ainda não chegou ao mercado — e o apresenta
              em particular.
            </p>

            <div className="space-y-5 text-[15px]">
              <div className="flex gap-4">
                <span className="text-primary text-[11px] tracking-[0.2em] uppercase w-20 pt-1">
                  Endereço
                </span>
                <span className="text-foreground/75">
                  Rua Comendador Araújo, 499 — Batel, Curitiba/PR
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-primary text-[11px] tracking-[0.2em] uppercase w-20 pt-1">
                  Contato
                </span>
                <span className="text-foreground/75">(41) 3333-4400 · 98800-4400</span>
              </div>
              <div className="flex gap-4">
                <span className="text-primary text-[11px] tracking-[0.2em] uppercase w-20 pt-1">
                  E-mail
                </span>
                <span className="text-foreground/75">contato@homeimoveis.com.br</span>
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div>
            {enviado ? (
              <div className="flex flex-col items-center justify-center h-full text-center border border-border p-12">
                <span className="font-heading text-5xl text-primary mb-4">Obrigado.</span>
                <p className="text-foreground/65 max-w-sm">
                  Recebemos sua mensagem. Nossa equipe de curadoria entrará em
                  contato em até 24 horas.
                </p>
                <button
                  onClick={() => {
                    setEnviado(false);
                    setForm({ nome: "", email: "", telefone: "", mensagem: "" });
                  }}
                  className="mt-8 text-[12px] tracking-[0.18em] uppercase text-primary underline underline-offset-4"
                >
                  Enviar outra mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-8">
                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-2">
                    Nome
                  </label>
                  <input
                    required
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    className={field}
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={field}
                      placeholder="voce@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-2">
                      Telefone
                    </label>
                    <input
                      value={form.telefone}
                      onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                      className={field}
                      placeholder="(41) 90000-0000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] tracking-[0.2em] uppercase text-foreground/50 mb-2">
                    Mensagem
                  </label>
                  <textarea
                    rows={4}
                    value={form.mensagem}
                    onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                    className={`${field} resize-none`}
                    placeholder="Conte sobre o estilo de vida que você busca..."
                  />
                </div>
                <button
                  type="submit"
                  className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 text-[12px] tracking-[0.2em] uppercase hover:bg-primary hover:text-primary-foreground transition-colors duration-500"
                >
                  Enviar mensagem
                  <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-500 group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}