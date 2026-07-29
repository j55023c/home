export function formatPrice(value: number, purpose?: string) {
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
  return purpose === "aluguel" ? `${formatted}/mês` : formatted;
}

export const TYPE_LABELS: Record<string, string> = {
  casa: "Casa",
  apartamento: "Apartamento",
  cobertura: "Cobertura",
  terreno: "Terreno",
  comercial: "Comercial",
};

export const PURPOSE_LABELS: Record<string, string> = {
  venda: "Venda",
  aluguel: "Aluguel",
};

export const WHATSAPP = "5567993488383";

export function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`;
}