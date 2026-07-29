import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type LinhaHistorico = {
  id: string;
  campo: string;
  valor_antigo: string | null;
  valor_novo: string | null;
  created_at: string;
};

const LABEL_CAMPO: Record<string, string> = {
  titulo: "Título",
  preco: "Preço",
  status: "Status",
  publicado: "Publicação",
  destaque: "Destaque",
  descricao: "Descrição",
};

function formatarData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HistoricoImovel({ imovelId }: { imovelId: string }) {
  const [historico, setHistorico] = useState<LinhaHistorico[]>([]);
  const [aberto, setAberto] = useState(false);
  const [carregado, setCarregado] = useState(false);

  useEffect(() => {
    if (!aberto || carregado) return;

    supabase
      .from("imovel_historico")
      .select("id, campo, valor_antigo, valor_novo, created_at")
      .eq("imovel_id", imovelId)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          setHistorico(data as LinhaHistorico[]);
        }
        setCarregado(true);
      });
  }, [aberto, carregado, imovelId]);

  return (
    <div className="border-t border-slate-100 pt-3">
      <button
        type="button"
        onClick={() => setAberto((a) => !a)}
        className="text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        {aberto ? "▾" : "▸"} Histórico de alterações
      </button>

      {aberto && (
        <div className="mt-2 max-h-48 space-y-1 overflow-y-auto text-xs text-slate-500">
          {!carregado ? (
            <p>Carregando...</p>
          ) : historico.length === 0 ? (
            <p>Nenhuma alteração registrada ainda.</p>
          ) : (
            historico.map((h) => (
              <div key={h.id} className="rounded bg-slate-50 px-2 py-1">
                <span className="font-medium text-slate-700">
                  {LABEL_CAMPO[h.campo] ?? h.campo}
                </span>{" "}
                alterado — {formatarData(h.created_at)}
                {h.valor_antigo !== null && h.valor_novo !== null && (
                  <span>
                    {" "}
                    ({h.valor_antigo} → {h.valor_novo})
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
