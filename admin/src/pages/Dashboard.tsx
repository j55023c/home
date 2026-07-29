import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCorretoraAtual } from "../hooks/useCorretoraAtual";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { Imovel } from "../types";
import { ImovelCard } from "../components/ImovelCard";
import { ImovelForm } from "../components/ImovelForm";
import { PainelNumeros } from "../components/PainelNumeros";
import { BarraFiltro, Filtros } from "../components/BarraFiltro";

const FILTROS_INICIAIS: Filtros = { busca: "", status: "todos", publicacao: "todos" };

export function Dashboard() {
  const { session } = useAuth();
  const { corretoraId, nome, whatsapp, loading: loadingCorretora } = useCorretoraAtual();
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [idsComFoto, setIdsComFoto] = useState<Set<string>>(new Set());
  const [loadingImoveis, setLoadingImoveis] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [formAberto, setFormAberto] = useState(false);
  const [imovelEmEdicao, setImovelEmEdicao] = useState<Imovel | null>(null);
  const [filtros, setFiltros] = useState<Filtros>(FILTROS_INICIAIS);
  const navigate = useNavigate();

  async function carregarImoveis(corretora: string) {
    setLoadingImoveis(true);
    const { data, error } = await supabase
      .from("imoveis")
      .select("*")
      .eq("corretora_id", corretora)
      .order("created_at", { ascending: false });

    if (error) {
      setErro("Não foi possível carregar os imóveis: " + error.message);
      setLoadingImoveis(false);
      return;
    }

    const lista = data as Imovel[];
    setImoveis(lista);
    setErro(null);

    // Busca em paralelo quais desses imóveis já têm ao menos uma foto,
    // para alimentar o alerta "sem foto ainda" no painel de números.
    if (lista.length > 0) {
      const { data: fotos } = await supabase
        .from("imovel_fotos")
        .select("imovel_id")
        .in("imovel_id", lista.map((i) => i.id));

      setIdsComFoto(new Set((fotos ?? []).map((f) => f.imovel_id)));
    } else {
      setIdsComFoto(new Set());
    }

    setLoadingImoveis(false);
  }

  useEffect(() => {
    if (corretoraId) {
      carregarImoveis(corretoraId);
    }
  }, [corretoraId]);

  const imoveisFiltrados = useMemo(() => {
    return imoveis.filter((imovel) => {
      const buscaLower = filtros.busca.trim().toLowerCase();
      const bateBusca =
        !buscaLower ||
        imovel.titulo.toLowerCase().includes(buscaLower) ||
        (imovel.bairro ?? "").toLowerCase().includes(buscaLower);

      const bateStatus = filtros.status === "todos" || imovel.status === filtros.status;

      const batePublicacao =
        filtros.publicacao === "todos" ||
        (filtros.publicacao === "publicado" && imovel.publicado) ||
        (filtros.publicacao === "rascunho" && !imovel.publicado);

      return bateBusca && bateStatus && batePublicacao;
    });
  }, [imoveis, filtros]);

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  function handleEditar(imovel: Imovel) {
    setImovelEmEdicao(imovel);
    setFormAberto(true);
  }

  function handleNovo() {
    setImovelEmEdicao(null);
    setFormAberto(true);
  }

  function handleFecharForm() {
    setFormAberto(false);
    setImovelEmEdicao(null);
  }

  if (loadingCorretora) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        Carregando...
      </div>
    );
  }

  if (!corretoraId) {
    return (
      <div className="flex h-screen items-center justify-center px-4 text-center text-slate-500">
        Não encontramos um cadastro de corretora vinculado a este login.
        <br />
        Fale com o administrador do sistema.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-slate-900">
              Painel Home Imobiliária
            </h1>
            <p className="text-sm text-slate-500">
              {nome ?? session?.user.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-800"
              onClick={handleNovo}
            >
              + Novo imóvel
            </button>
            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"
            >
              Sair
            </button>
          </div>
        </div>

        {erro && (
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {erro}
          </p>
        )}

        {!loadingImoveis && imoveis.length > 0 && (
          <PainelNumeros imoveis={imoveis} idsComFoto={idsComFoto} />
        )}

        {!loadingImoveis && imoveis.length > 0 && (
          <BarraFiltro filtros={filtros} onChange={setFiltros} />
        )}

        {loadingImoveis ? (
          <p className="text-slate-400">Carregando imóveis...</p>
        ) : imoveis.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">
            Nenhum imóvel cadastrado ainda. Clique em "+ Novo imóvel" para começar.
          </div>
        ) : imoveisFiltrados.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400">
            Nenhum imóvel corresponde a esse filtro.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {imoveisFiltrados.map((imovel) => (
              <ImovelCard
                key={imovel.id}
                imovel={imovel}
                corretoraWhatsapp={whatsapp}
                onAtualizado={() => carregarImoveis(corretoraId)}
                onEditar={handleEditar}
              />
            ))}
          </div>
        )}
      </div>

      {formAberto && (
        <ImovelForm
          corretoraId={corretoraId}
          imovelExistente={imovelEmEdicao}
          onFechar={handleFecharForm}
          onSalvo={() => carregarImoveis(corretoraId)}
        />
      )}
    </div>
  );
}
