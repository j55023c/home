import { useEffect, useState } from "react";
import { ImovelFoto } from "../types";
import { useFotosImovel } from "../hooks/useFotosImovel";

export function GaleriaFotos({ imovelId }: { imovelId: string }) {
  const { enviando, listarFotos, enviarFotos, removerFoto, reordenarFotos } =
    useFotosImovel(imovelId);
  const [fotos, setFotos] = useState<ImovelFoto[]>([]);
  const [arrastandoIndex, setArrastandoIndex] = useState<number | null>(null);

  async function recarregar() {
    setFotos(await listarFotos());
  }

  useEffect(() => {
    recarregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imovelId]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    await enviarFotos(e.target.files, fotos.length);
    e.target.value = "";
    await recarregar();
  }

  async function handleRemover(foto: ImovelFoto) {
    if (!confirm("Remover esta foto?")) return;
    await removerFoto(foto);
    await recarregar();
  }

  function handleDrop(index: number) {
    if (arrastandoIndex === null || arrastandoIndex === index) return;
    const novaLista = [...fotos];
    const [movida] = novaLista.splice(arrastandoIndex, 1);
    novaLista.splice(index, 0, movida);
    setFotos(novaLista);
    setArrastandoIndex(null);
    reordenarFotos(novaLista);
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Fotos {fotos.length > 0 && <span className="text-slate-400">(arraste para reordenar — a primeira é a capa)</span>}
      </label>

      <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
        {fotos.map((foto, index) => (
          <div
            key={foto.id}
            draggable
            onDragStart={() => setArrastandoIndex(index)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleDrop(index)}
            className="group relative aspect-square cursor-move overflow-hidden rounded-lg border border-slate-200"
          >
            <img src={foto.url} className="h-full w-full object-cover" />
            {index === 0 && (
              <span className="absolute left-1 top-1 rounded bg-slate-900/80 px-1.5 py-0.5 text-[10px] text-white">
                Capa
              </span>
            )}
            <button
              type="button"
              onClick={() => handleRemover(foto)}
              className="absolute right-1 top-1 rounded-full bg-red-600/90 px-1.5 py-0.5 text-[10px] text-white opacity-0 group-hover:opacity-100"
            >
              remover
            </button>
          </div>
        ))}
      </div>

      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        disabled={enviando}
        className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-1.5 file:text-sm file:text-white hover:file:bg-slate-800"
      />
      {enviando && <p className="mt-1 text-xs text-slate-400">Enviando fotos...</p>}
    </div>
  );
}
