import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useCreateLead } from "../queries/properties";

interface Props {
  compact?: boolean;
  propertyId?: string;
  defaultMessage?: string;
}

export function ContactForm({ compact = false, propertyId, defaultMessage = "" }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const createLead = useCreateLead();

  const inputCls =
    "w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold outline-none transition-colors";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    
    // Mapear campos do formulário para a API
    createLead.mutate({
      nome: name,
      telefone: phone,
      email: email,
      mensagem: message,
      imovel_id: propertyId,
    });
  }

  if (createLead.isSuccess) {
    return (
      <div className="border border-gold/40 bg-accent p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center mx-auto mb-4">
          <Check className="text-gold" size={24} />
        </div>
        <p className="font-display text-lg text-foreground mb-1">Mensagem enviada!</p>
        <p className="text-sm text-muted-foreground">
          Obrigado, {name.split(" ")[0]}. Em breve entraremos em contato.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={compact ? "space-y-3" : "space-y-4"}>
      <input
        className={inputCls}
        placeholder="Nome completo *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <div className={compact ? "space-y-3" : "grid sm:grid-cols-2 gap-4"}>
        <input
          className={inputCls}
          type="email"
          placeholder="E-mail *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className={inputCls}
          placeholder="Telefone / WhatsApp"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <textarea
        className={`${inputCls} resize-none`}
        rows={compact ? 3 : 4}
        placeholder="Mensagem"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      {createLead.isError && (
        <p className="text-sm text-destructive">Não foi possível enviar. Tente novamente.</p>
      )}
      <button
        type="submit"
        disabled={createLead.isPending}
        className="flex items-center justify-center gap-2 w-full bg-gold text-black py-3.5 text-sm uppercase tracking-[0.16em] hover:bg-gold-soft transition-colors disabled:opacity-60"
      >
        {createLead.isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Enviando…
          </>
        ) : (
          "Enviar mensagem"
        )}
      </button>
    </form>
  );
}