import { Imovel, StatusImovel } from "../types";
import { supabase } from "../lib/supabase";

const STATUS_LABEL: Record<StatusImovel, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};

const STATUS_COLOR: Record<StatusImovel, string> = {
  disponivel: "bg-green-100 text-green-700",
  reservado: "bg-amber-100 text-amber-700",
  vendido: "bg-slate-200 text-slate-600",
};

const PROXIMO_STATUS: Record<StatusImovel, StatusImovel> = {
  disponivel: "reservado",
  reservado: "vendido",
  vendido: "disponivel",
};

const DIAS_PARA_CONSIDERAR_PARADO = 90;

function formatarPreco(preco: number | null) {
  if (preco === null) return "Preço sob consulta";
  return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function diasDesde(dataIso: string) {
  const diffMs = Date.now() - new Date(dataIso).getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function ImovelCard({
  imovel,
  corretoraWhatsapp,
  onAtualizado,
  onEditar,
}: {
  imovel: Imovel;
  corretoraWhatsapp: string | null;
  onAtualizado: () => void;
  onEditar: (imovel: Imovel) => void;
}) {
  const diasParado = diasDesde(imovel.updated_at);
  const estaParado = diasParado >= DIAS_PARA_CONSIDERAR_PARADO;

  async function alternarStatus() {
    const novoStatus = PROXIMO_STATUS[imovel.status];
    const { error } = await supabase
      .from("imoveis")
      .update({ status: novoStatus, updated_at: new Date().toISOString() })
      .eq("id", imovel.id);

    if (error) {
      alert("Não foi possível atualizar o status: " + error.message);
      return;
    }
    onAtualizado();
  }

  async function alternarDestaque() {
    const { error } = await supabase
      .from("imoveis")
      .update({ destaque: !imovel.destaque, updated_at: new Date().toISOString() })
      .eq("id", imovel.id);

    if (error) {
      alert("Não foi possível atualizar o destaque: " + error.message);
      return;
    }
    onAtualizado();
  }

  async function alternarPublicado() {
    const { error } = await supabase
      .from("imoveis")
      .update({ publicado: !imovel.publicado, updated_at: new Date().toISOString() })
      .eq("id", imovel.id);

    if (error) {
      alert("Não foi possível atualizar a publicação: " + error.message);
      return;
    }
    onAtualizado();
  }

  async function duplicar() {
    // Copia os campos do imóvel, sem id (gera um novo) e como rascunho,
    // para a corretora revisar antes de publicar a cópia.
    const {
      id,
      created_at,
      updated_at,
      ...camposParaCopiar
    } = imovel;

    const { error } = await supabase.from("imoveis").insert({
      ...camposParaCopiar,
      titulo: `${imovel.titulo} (cópia)`,
      publicado: false,
      destaque: false,
    });

    if (error) {
      alert("Não foi possível duplicar: " + error.message);
      return;
    }
    onAtualizado();
  }

  async function excluir() {
    if (!confirm(`Apagar o imóvel "${imovel.titulo}"? Essa ação não pode ser desfeita.`)) {
      return;
    }
    const { error } = await supabase.from("imoveis").delete().eq("id", imovel.id);
    if (error) {
      alert("Não foi possível apagar: " + error.message);
      return;
    }
    onAtualizado();
  }

  function compartilharWhatsapp() {
    if (!corretoraWhatsapp) {
      alert("Número de WhatsApp da corretora ainda não está cadastrado.");
      return;
    }
    const mensagem = `Olá! Tenho interesse no imóvel "${imovel.titulo}"${
      imovel.bairro ? ` no bairro ${imovel.bairro}` : ""
    }. Pode me passar mais detalhes?`;
    const link = `https://wa.me/${corretoraWhatsapp}?text=${encodeURIComponent(mensagem)}`;
    window.open(link, "_blank");
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-medium text-slate-900">{imovel.titulo}</h3>
          <p className="text-sm text-slate-500">
            {imovel.bairro ? `${imovel.bairro}, ` : ""}
            {imovel.cidade}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {imovel.destaque && (
            <span className="whitespace-nowrap rounded-full bg-slate-900 px-2 py-0.5 text-xs font-medium text-white">
              Destaque
            </span>
          )}
          {!imovel.publicado && (
            <span className="whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              Rascunho
            </span>
          )}
          {estaParado && (
            <span
              className="whitespace-nowrap rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600"
              title={`Sem alterações há ${diasParado} dias`}
            >
              Parado há {diasParado}d
            </span>
          )}
        </div>
      </div>

      <p className="text-lg font-semibold text-slate-900">
        {formatarPreco(imovel.preco)}
      </p>

      <div className="flex flex-wrap gap-3 text-sm text-slate-500">
        {imovel.quartos !== null && <span>{imovel.quartos} quartos</span>}
        {imovel.banheiros !== null && <span>{imovel.banheiros} banheiros</span>}
        {imovel.vagas !== null && <span>{imovel.vagas} vagas</span>}
        {imovel.area_m2 !== null && <span>{imovel.area_m2} m²</span>}
      </div>

      <button
        onClick={alternarStatus}
        className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLOR[imovel.status]}`}
        title="Clique para avançar o status"
      >
        {STATUS_LABEL[imovel.status]}
      </button>

      <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3">
        <button
          onClick={compartilharWhatsapp}
          className="rounded-lg border border-green-300 bg-green-50 px-2 py-1 text-xs text-green-700 hover:bg-green-100"
        >
          WhatsApp
        </button>
        <button
          onClick={alternarPublicado}
          className={`rounded-lg border px-2 py-1 text-xs ${
            imovel.publicado
              ? "border-slate-300 text-slate-600 hover:bg-slate-50"
              : "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
          }`}
        >
          {imovel.publicado ? "Despublicar" : "Publicar"}
        </button>
        <button
          onClick={alternarDestaque}
          className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
        >
          {imovel.destaque ? "Remover destaque" : "Destacar"}
        </button>
        <button
          onClick={() => onEditar(imovel)}
          className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
        >
          Editar
        </button>
        <button
          onClick={duplicar}
          className="rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50"
        >
          Duplicar
        </button>
        <button
          onClick={excluir}
          className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
        >
          Apagar
        </button>
      </div>
    </div>
  );
}
