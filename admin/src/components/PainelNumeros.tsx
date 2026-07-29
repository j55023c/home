import { Imovel } from "../types";

export function PainelNumeros({
  imoveis,
  idsComFoto,
}: {
  imoveis: Imovel[];
  idsComFoto: Set<string>;
}) {
  const total = imoveis.length;
  const publicados = imoveis.filter((i) => i.publicado).length;
  const rascunhos = total - publicados;
  const semFoto = imoveis.filter((i) => !idsComFoto.has(i.id)).length;

  const cards = [
    { label: "Imóveis ativos", valor: total },
    { label: "Publicados", valor: publicados },
    { label: "Rascunhos", valor: rascunhos },
    { label: "Sem foto ainda", valor: semFoto, alerta: semFoto > 0 },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className={`rounded-2xl border p-4 ${
            c.alerta ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"
          }`}
        >
          <p className={`text-2xl font-semibold ${c.alerta ? "text-amber-700" : "text-slate-900"}`}>
            {c.valor}
          </p>
          <p className={`text-sm ${c.alerta ? "text-amber-600" : "text-slate-500"}`}>{c.label}</p>
        </div>
      ))}
    </div>
  );
}
