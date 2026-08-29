import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { Camera, X, Image as ImageIcon, Eye, Upload, AlertCircle, CheckCircle } from "lucide-react";

interface CorretoraProfileProps {
  onAtualizado?: () => void;
}

// Mapeamento das fotos do "Sobre" (fallback inicial)
const SOBRE_IMAGES: Record<string, string> = {
  "Liliane de Lima Texeira": "/images/team/liliane.png",
  "Liliane de Lima Teixeira": "/images/team/liliane.png",
  "Marilza Galante": "/images/team/marilza.png",
  "Silvana Garcia": "/images/team/silvana.png",
};

export function CorretoraProfile({ onAtualizado }: CorretoraProfileProps) {
  const { session } = useAuth();
  const [corretora, setCorretora] = useState<{
    id: string;
    nome: string;
    whatsapp: string | null;
    creci: string | null;
    foto_url: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  // Tamanhos permitidos e tipos
  const MAX_SIZE_MB = 2;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const RECOMMENDED_DIMENSIONS = "400x400px (quadrada)";

  const addDebug = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev.slice(-9), `[${timestamp}] ${msg}`]);
    console.log(`[CorretoraProfile] ${msg}`);
  };

  // Buscar corretora logada
  const buscarCorretora = async () => {
    if (!session) return;
    try {
      addDebug("Buscando corretora...");
      const { data, error } = await supabase
        .from("corretoras")
        .select("id, nome, whatsapp, creci, foto_url")
        .eq("auth_user_id", session.user.id)
        .single();

      if (error) throw error;
      if (data) {
        addDebug(`Corretora encontrada: ${data.nome}, foto_url: ${data.foto_url || 'null'}`);
        // Se não tem foto_url no Supabase, tenta usar a do "Sobre" como preview inicial
        const sobreFoto = data.nome && SOBRE_IMAGES[data.nome] ? SOBRE_IMAGES[data.nome] : null;
        setCorretora({ ...data, foto_url: data.foto_url || sobreFoto });
        addDebug(`Foto final: ${data.foto_url || sobreFoto || 'null'}`);
      }
    } catch (e: any) {
      addDebug(`Erro ao buscar: ${e.message}`);
      setErro("Erro ao carregar corretora: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarCorretora();
  }, [session]);

  // Upload da foto
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validação de tipo
    if (!ALLOWED_TYPES.includes(file.type)) {
      setErro("Tipo de arquivo não permitido. Use JPG, PNG ou WebP.");
      return;
    }

    // Validação de tamanho
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErro(`Arquivo muito grande. Máximo ${MAX_SIZE_MB}MB.`);
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setUploading(true);
    setErro(null);
    setSucesso(null);
    addDebug(`Iniciando upload: ${file.name} (${(file.size/1024).toFixed(1)}KB)`);

    try {
      if (!corretora) throw new Error("Corretora não carregada");

      const fileExt = file.name.split(".").pop();
      const fileName = `${corretora.id}-${Date.now()}.${fileExt}`;
      const filePath = `${corretora.id}/${fileName}`;
      addDebug(`Upload para: ${filePath}`);

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from("corretoras-fotos")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        addDebug(`Erro upload: ${uploadError.message}`);
        throw uploadError;
      }
      addDebug(`Upload OK: ${JSON.stringify(uploadData)}`);

      const { data: publicUrlData } = supabase.storage
        .from("corretoras-fotos")
        .getPublicUrl(filePath);

      const fotoUrl = publicUrlData.publicUrl;
      addDebug(`Public URL: ${fotoUrl}`);

      // Atualiza coluna na tabela
      addDebug(`Atualizando tabela corretoras...`);
      const { error: updateError } = await supabase
        .from("corretoras")
        .update({ foto_url: fotoUrl })
        .eq("id", corretora.id);

      if (updateError) {
        addDebug(`Erro update tabela: ${updateError.message}`);
        throw updateError;
      }
      addDebug(`Tabela atualizada com sucesso`);

      setCorretora((prev) => (prev ? { ...prev, foto_url: fotoUrl } : null));
      setSucesso("Foto atualizada com sucesso!");
      setPreview(fotoUrl);
      onAtualizado?.();
    } catch (e: any) {
      const msg = e.message || "Erro desconhecido";
      addDebug(`ERRO: ${msg}`);
      setErro(`Erro no upload: ${msg}`);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  // Remover foto
  const handleRemoverFoto = async () => {
    if (!corretora) return;

    setUploading(true);
    setErro(null);
    setSucesso(null);
    addDebug("Removendo foto...");

    try {
      const { error } = await supabase
        .from("corretoras")
        .update({ foto_url: null })
        .eq("id", corretora.id);

      if (error) throw error;

      // Se remover, volta pro fallback do "Sobre" se tiver
      const sobreFoto = corretora.nome && SOBRE_IMAGES[corretora.nome] ? SOBRE_IMAGES[corretora.nome] : null;
      setCorretora((prev) => (prev ? { ...prev, foto_url: sobreFoto } : null));
      setSucesso("Foto removida. Usando foto padrão do Sobre.");
      setPreview(null);
      addDebug(`Foto removida, fallback: ${sobreFoto || 'none'}`);
      onAtualizado?.();
    } catch (e: any) {
      addDebug(`Erro remover: ${e.message}`);
      setErro("Erro ao remover: " + e.message);
    } finally {
      setUploading(false);
    }
  };

  // Renderiza o card de preview (como fica no site)
  const renderPreviewCard = (imgUrl: string, variante: "site" | "sobre") => {
    const isSobre = variante === "sobre";

    return (
      <div className="relative bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="aspect-square relative bg-slate-50">
          {imgUrl && (
            <img
              src={imgUrl}
              alt={corretora?.nome || "Corretora"}
              className="w-full h-full object-cover"
            />
          )}
          {!imgUrl && (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <ImageIcon size={48} />
            </div>
          )}
        </div>

        {/* Badge da variante */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              isSobre
                ? "bg-amber-100 text-amber-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {isSobre ? "Página Sobre" : "Vitrine Imóvel"}
          </span>
        </div>

        {/* Info overlay (simula card do imóvel) */}
        {!isSobre && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent p-4">
            <div className="absolute bottom-0 left-0 right-0">
              <p className="text-white text-sm font-semibold truncate">
                {corretora?.nome}
              </p>
              {corretora?.creci && (
                <p className="text-white/80 text-xs">CRECI: {corretora.creci}</p>
              )}
            </div>
          </div>
        )}

        {isSobre && (
          <div className="p-3 bg-white border-t border-slate-100">
            <p className="text-sm font-semibold text-slate-900">{corretora?.nome}</p>
            {corretora?.creci && (
              <p className="text-xs text-amber-600 font-medium">CRECI: {corretora.creci}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-4" />
        <p className="text-slate-500">Carregando perfil...</p>
      </div>
    );
  }

  if (!corretora) {
    return (
      <div className="rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        Corretora não encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Minha Foto no Site</h2>
          <p className="text-sm text-slate-500">
            Esta foto aparece na vitrine dos imóveis e na página "Sobre" da imobiliária.
          </p>
        </div>
      </div>

      {/* Debug Panel */}
      <details className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <summary className="cursor-pointer font-mono text-xs text-slate-600">Debug Logs (clique para expandir)</summary>
        <div className="mt-2 font-mono text-xs text-slate-700 max-h-40 overflow-auto">
          {debugInfo.map((log, i) => (
            <div key={i} className="font-mono text-[10px]">{log}</div>
          ))}
        </div>
      </details>

      {/* Alertas */}
      {erro && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 flex items-center gap-3">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <p className="text-sm text-red-700">{erro}</p>
        </div>
      )}
      {sucesso && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-center gap-3">
          <CheckCircle className="text-green-500 shrink-0" size={20} />
          <p className="text-sm text-green-700">{sucesso}</p>
        </div>
      )}

      {/* Previews lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preview Vitrine (card do imóvel) */}
        {renderPreviewCard(corretora.foto_url || preview || "", "site")}

        {/* Preview Página Sobre */}
        {renderPreviewCard(corretora.foto_url || preview || "", "sobre")}
      </div>

      {/* Upload Area */}
      <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          id="corretora-foto-upload"
          className="hidden"
          disabled={uploading}
        />

        <label
          htmlFor="corretora-foto-upload"
          className={`flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors ${
            uploading ? "opacity-50 cursor-wait" : "hover:border-slate-400 hover:bg-white"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
              <Camera size={28} className="text-slate-500" />
            </div>
            <div className="text-center">
              <p className="font-medium text-slate-900">
                {preview || corretora.foto_url
                  ? "Clique para alterar a foto"
                  : "Clique ou arraste para adicionar foto"}
              </p>
              <p className="text-sm text-slate-500 mt-1">
                JPG, PNG ou WebP · Máx. {MAX_SIZE_MB}MB · Recomendado: {RECOMMENDED_DIMENSIONS}
              </p>
            </div>
          </div>

          {uploading && (
            <div className="flex items-center gap-2 text-slate-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-900" />
              <span className="text-sm">Enviando...</span>
            </div>
          )}
        </label>

        {(corretora.foto_url || preview) && !uploading && (
          <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={() => {
                setPreview(corretora.foto_url || null);
                setShowPreviewModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Eye size={16} /> Ver em tamanho real
            </button>

            {corretora.foto_url && (
              <button
                type="button"
                onClick={handleRemoverFoto}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-300 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                <X size={16} /> Remover foto
              </button>
            )}
          </div>
        )}

        {/* Info de requisitos */}
        <div className="mt-6 p-4 rounded-lg bg-white border border-slate-200">
          <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
            <Upload size={18} /> Dicas para uma boa foto
          </h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
              Foto quadrada (1:1) — 400x400px ou maior
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
              Fundo neutro ou do escritório (evita corte estranho)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
              Rosto centralizado, ombros visíveis
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
              Boa iluminação (evite contraluz)
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
              Formato: JPG, PNG ou WebP · Máx 2MB
            </li>
          </ul>
        </div>
      </div>

      {/* Modal Preview Fullscreen */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowPreviewModal(false)}
        >
          <div className="relative max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
            >
              <X size={24} />
            </button>
            <div className="aspect-square rounded-xl overflow-hidden bg-white">
              <img
                src={preview || corretora.foto_url || ""}
                alt={corretora.nome}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-4 text-center text-white">
              <p className="font-semibold">{corretora.nome}</p>
              {corretora.creci && <p className="text-amber-300 text-sm">CRECI: {corretora.creci}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}