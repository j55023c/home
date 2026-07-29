import { useState } from "react";
import { supabase } from "../lib/supabase";
import { ImovelFoto } from "../types";

export function useFotosImovel(imovelId: string | null) {
  const [enviando, setEnviando] = useState(false);

  async function listarFotos(): Promise<ImovelFoto[]> {
    if (!imovelId) return [];
    const { data, error } = await supabase
      .from("imovel_fotos")
      .select("*")
      .eq("imovel_id", imovelId)
      .order("ordem", { ascending: true });

    if (error) {
      console.error("Erro ao listar fotos:", error.message);
      return [];
    }
    return data as ImovelFoto[];
  }

  async function enviarFotos(files: FileList, ordemInicial: number) {
    if (!imovelId) return;
    setEnviando(true);

    let ordem = ordemInicial;
    for (const file of Array.from(files)) {
      const extensao = file.name.split(".").pop();
      const nomeArquivo = `${imovelId}/${crypto.randomUUID()}.${extensao}`;

      const { error: erroUpload } = await supabase.storage
        .from("imoveis")
        .upload(nomeArquivo, file);

      if (erroUpload) {
        alert(`Erro ao enviar "${file.name}": ${erroUpload.message}`);
        continue;
      }

      const { data: urlPublica } = supabase.storage
        .from("imoveis")
        .getPublicUrl(nomeArquivo);

      const { error: erroInsert } = await supabase.from("imovel_fotos").insert({
        imovel_id: imovelId,
        url: urlPublica.publicUrl,
        ordem,
      });

      if (erroInsert) {
        alert(`Erro ao salvar referência da foto "${file.name}": ${erroInsert.message}`);
      }

      ordem++;
    }

    setEnviando(false);
  }

  async function removerFoto(foto: ImovelFoto) {
    // Extrai o caminho dentro do bucket a partir da URL pública
    const partes = foto.url.split("/imoveis/");
    const caminho = partes[1];

    if (caminho) {
      await supabase.storage.from("imoveis").remove([caminho]);
    }

    const { error } = await supabase.from("imovel_fotos").delete().eq("id", foto.id);
    if (error) {
      alert("Erro ao remover foto: " + error.message);
    }
  }

  async function reordenarFotos(fotos: ImovelFoto[]) {
    // Recebe a lista já na nova ordem e persiste o campo "ordem" de cada uma
    const atualizacoes = fotos.map((foto, index) =>
      supabase.from("imovel_fotos").update({ ordem: index }).eq("id", foto.id)
    );
    await Promise.all(atualizacoes);
  }

  return { enviando, listarFotos, enviarFotos, removerFoto, reordenarFotos };
}
