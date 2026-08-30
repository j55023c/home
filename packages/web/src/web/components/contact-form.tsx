import { useState } from "react";
import { Loader2, Send } from "lucide-react";

interface Props {
  compact?: boolean;
  propertyId?: string;
  propertyTitle?: string;
  propertyReference?: string;
  propertyPrice?: number;
  propertyPurpose?: string;
  defaultMessage?: string;
}

export function ContactForm({ 
  compact = false, 
  propertyId, 
  propertyTitle,
  propertyReference,
  propertyPrice,
  propertyPurpose,
  defaultMessage = "" 
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(defaultMessage);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const formatPrice = (price: number, purpose: string) => {
    if (!price) return "Consultar";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price) + (purpose === "aluguel" ? "/mês" : "");
  };

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nome é obrigatório");
      return;
    }
    if (!phone.trim()) {
      setError("Telefone/WhatsApp é obrigatório");
      return;
    }
    
    // Build WhatsApp message
    let waMessage = `Olá! Tenho interesse`;
    
    if (propertyTitle) {
      waMessage += ` no imóvel "${propertyTitle}"`;
      if (propertyReference) waMessage += ` (Ref. ${propertyReference})`;
      waMessage += ` - ${propertyPrice ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(propertyPrice) + (propertyPurpose === "aluguel" ? "/mês" : "") : "Consultar"}`;
    }
    
    waMessage += `. Meu nome é ${name.trim()}.`;
    
    if (email) waMessage += ` E-mail: ${email.trim()}.`;
    waMessage += ` Telefone: ${phone.trim()}.`;
    
    if (message.trim()) waMessage += ` Mensagem: ${message.trim()}.`;
    
    waMessage += ` Aguardo retorno.`;

    // WhatsApp number from env or default
    const whatsappNumber = import.meta.env.VITE_WHATSAPP || "5567993488383";
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMessage)}`;
    
    window.open(waUrl, "_blank", "noopener,noreferrer");
  }

  const inputCls =
    "w-full bg-transparent border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold outline-none transition-colors";

  return (
    <form onSubmit={submit} className={compact ? "space-y-3" : "space-y-4"}>
      <input
        className={inputCls}
        placeholder="Nome completo *"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        autoFocus
      />
      <div className={compact ? "space-y-3" : "grid sm:grid-cols-2 gap-4"}>
        <input
          className={inputCls}
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className={inputCls}
          placeholder="Telefone / WhatsApp *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <textarea
        className={`${inputCls} resize-none`}
        rows={compact ? 3 : 4}
        placeholder="Mensagem (opcional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 w-full bg-gold text-black py-3.5 text-sm uppercase tracking-[0.16em] hover:bg-gold-soft transition-colors disabled:opacity-60"
      >
        <Send size={16} /> Enviar pelo WhatsApp
      </button>
    </form>
  );
}