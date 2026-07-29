import { FormEvent, useState } from "react";
import { supabase } from "../lib/supabase";
import { Imovel } from "../types";
import { GaleriaFotos } from "./GaleriaFotos";
import { HistoricoImovel } from "./HistoricoImovel";

type Props = {
  corretoraId: string;
  imovelExistente: Imovel | null;
  onFechar: () => void;
  onSalvo: () => void;
};

const CARACTERISTICAS_DISPONIVEIS = [
  "Ar Condicionado",
  "Móveis Planejados",
  "Portão Eletrônico",
  "Área Gourmet",
  "Cozinha Americana",
  "Suíte Master",
  "Escritório",
  "Área de Serviço",
  "Cerca Elétrica",
  "Poço Artesiano",
  "Churrasqueira",
  "Piscina",
  "Perto de Escola",
  "Perto de Supermercado",
  "Perto de Shopping",
];

const CAMPOS_VAZIOS = {
  titulo: "",
  tipo: "casa",
  finalidade: "venda",
  preco: "",
  endereco: "",
  bairro: "",
  cidade: "Três Lagoas",
  quartos: "",
  banheiros: "",
  vagas: "",
  area_m2: "",
  area_util: "",
  suites: "",
  ano_construcao: "",
  iptu: "",
  condominio: "",
  taxas: "",
  descricao: "",
};

export function ImovelForm({ corretoraId, imovelExistente, onFechar, onSalvo }: Props) {
  const [campos, setCampos] = useState(
    imovelExistente
      ? {
          titulo: imovelExistente.titulo,
          tipo: imovelExistente.tipo,
          finalidade: imovelExistente.finalidade,
          preco: imovelExistente.preco?.toString() ?? "",
          endereco: imovelExistente.endereco ?? "",
          bairro: imovelExistente.bairro ?? "",
          cidade: imovelExistente.cidade ?? "Três Lagoas",
          quartos: imovelExistente.quartos?.toString() ?? "",
          banheiros: imovelExistente.banheiros?.toString() ?? "",
          vagas: imovelExistente.vagas?.toString() ?? "",
          area_m2: imovelExistente.area_m2?.toString() ?? "",
          area_util: imovelExistente.area_util?.toString() ?? "",
          suites: imovelExistente.suites?.toString() ?? "",
          ano_construcao: imovelExistente.ano_construcao?.toString() ?? "",
          iptu: imovelExistente.iptu?.toString() ?? "",
          condominio: imovelExistente.condominio?.toString() ?? "",
          taxas: imovelExistente.taxas?.toString() ?? "",
          descricao: imovelExistente.descricao ?? "",
        }
      : CAMPOS_VAZIOS
  );
  const [caracteristicas, setCaracteristicas] = useState<string[]>(
    imovelExistente?.caracteristicas ?? []
  );
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  // Id do imóvel salvo — necessário pra mostrar a galeria de fotos mesmo em um imóvel recém-criado
  const [imovelId, setImovelId] = useState<string | null>(imovelExistente?.id ?? null);

  function atualizarCampo(campo: keyof typeof CAMPOS_VAZIOS, valor: string) {
    setCampos((atual) => ({ ...atual, [campo]: valor }));
  }

  function alternarCaracteristica(item: string) {
    setCaracteristicas((atual) =>
      atual.includes(item) ? atual.filter((c) => c !== item) : [...atual, item]
    );
  }

  // Cálculo automático de valor por m² — não é campo editável,
  // só um dado de apoio mostrado na tela pra corretora conferir.
  const valorPorM2 =
    campos.preco && campos.area_m2
      ? (Number(campos.preco) / Number(campos.area_m2)).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })
      : null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErro(null);

    if (!campos.titulo.trim()) {
      setErro("O título é obrigatório.");
      return;
    }

    setSalvando(true);

    const payload = {
      titulo: campos.titulo.trim(),
      tipo: campos.tipo,
      finalidade: campos.finalidade,
      preco: campos.preco ? Number(campos.preco) : null,
      endereco: campos.endereco || null,
      bairro: campos.bairro || null,
      cidade: campos.cidade || null,
      quartos: campos.quartos ? Number(campos.quartos) : null,
      banheiros: campos.banheiros ? Number(campos.banheiros) : null,
      vagas: campos.vagas ? Number(campos.vagas) : null,
      area_m2: campos.area_m2 ? Number(campos.area_m2) : null,
      area_util: campos.area_util ? Number(campos.area_util) : null,
      suites: campos.suites ? Number(campos.suites) : null,
      ano_construcao: campos.ano_construcao ? Number(campos.ano_construcao) : null,
      iptu: campos.iptu ? Number(campos.iptu) : null,
      condominio: campos.condominio ? Number(campos.condominio) : null,
      taxas: campos.taxas ? Number(campos.taxas) : null,
      caracteristicas,
      descricao: campos.descricao || null,
      updated_at: new Date().toISOString(),
    };

    if (imovelId) {
      const { error } = await supabase.from("imoveis").update(payload).eq("id", imovelId);
      setSalvando(false);
      if (error) {
        setErro("Não foi possível salvar: " + error.message);
        return;
      }
      onSalvo();
    } else {
      const { data, error } = await supabase
        .from("imoveis")
        .insert({ ...payload, corretora_id: corretoraId, publicado: false })
        .select()
        .single();
      setSalvando(false);
      if (error || !data) {
        setErro("Não foi possível criar: " + (error?.message ?? "erro desconhecido"));
        return;
      }
      setImovelId(data.id);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            {imovelId ? "Editar imóvel" : "Novo imóvel"}
          </h2>
          <button onClick={onFechar} className="text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Título *</label>
            <input
              value={campos.titulo}
              onChange={(e) => atualizarCampo("titulo", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              placeholder="Ex: Casa 3 quartos no Jardim Alvorada"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Tipo</label>
              <select
                value={campos.tipo}
                onChange={(e) => atualizarCampo("tipo", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="terreno">Terreno</option>
                <option value="comercial">Comercial</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Finalidade</label>
              <select
                value={campos.finalidade}
                onChange={(e) => atualizarCampo("finalidade", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Endereço</label>
            <input
              value={campos.endereco}
              onChange={(e) => atualizarCampo("endereco", e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-slate-400">
              Uso interno apenas — o endereço nunca aparece na vitrine pública do site.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Bairro</label>
              <input
                value={campos.bairro}
                onChange={(e) => atualizarCampo("bairro", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Cidade</label>
              <input
                value={campos.cidade}
                onChange={(e) => atualizarCampo("cidade", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Quartos</label>
              <input
                type="number"
                value={campos.quartos}
                onChange={(e) => atualizarCampo("quartos", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Suítes</label>
              <input
                type="number"
                value={campos.suites}
                onChange={(e) => atualizarCampo("suites", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Banheiros</label>
              <input
                type="number"
                value={campos.banheiros}
                onChange={(e) => atualizarCampo("banheiros", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Vagas</label>
              <input
                type="number"
                value={campos.vagas}
                onChange={(e) => atualizarCampo("vagas", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Área Total (m²)</label>
              <input
                type="number"
                value={campos.area_m2}
                onChange={(e) => atualizarCampo("area_m2", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Área Útil (m²)</label>
              <input
                type="number"
                value={campos.area_util}
                onChange={(e) => atualizarCampo("area_util", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Ano Construção</label>
              <input
                type="number"
                value={campos.ano_construcao}
                onChange={(e) => atualizarCampo("ano_construcao", e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                placeholder="Ex: 2018"
              />
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-3">
            <p className="mb-2 text-sm font-medium text-slate-700">Valores</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs text-slate-500">Valor do imóvel (R$)</label>
                <input
                  type="number"
                  value={campos.preco}
                  onChange={(e) => atualizarCampo("preco", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Ex: 350000"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">IPTU (R$)</label>
                <input
                  type="number"
                  value={campos.iptu}
                  onChange={(e) => atualizarCampo("iptu", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Condomínio (R$)</label>
                <input
                  type="number"
                  value={campos.condominio}
                  onChange={(e) => atualizarCampo("condominio", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-500">Taxas (R$)</label>
                <input
                  type="number"
                  value={campos.taxas}
                  onChange={(e) => atualizarCampo("taxas", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            {valorPorM2 && (
              <p className="mt-2 text-xs text-slate-400">
                Valor por m² (calculado automaticamente): {valorPorM2}
              </p>
            )}
            <p className="mt-1 text-xs text-slate-400">
              Deixando "Valor do imóvel" em branco, o site mostra "Consultar".
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Características</label>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-3">
              {CARACTERISTICAS_DISPONIVEIS.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={caracteristicas.includes(item)}
                    onChange={() => alternarCaracteristica(item)}
                    className="rounded border-slate-300"
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Descrição</label>
            <textarea
              value={campos.descricao}
              onChange={(e) => atualizarCampo("descricao", e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          {imovelId ? (
            <>
              <GaleriaFotos imovelId={imovelId} />
              <HistoricoImovel imovelId={imovelId} />
            </>
          ) : (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-400">
              Salve o imóvel primeiro para poder adicionar fotos. Ele será criado
              como rascunho — não aparece no site até você clicar em "Publicar".
            </p>
          )}

          {erro && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{erro}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                onSalvo();
                onFechar();
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              {imovelId ? "Concluir" : "Cancelar"}
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {salvando ? "Salvando..." : imovelId ? "Salvar alterações" : "Criar imóvel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
