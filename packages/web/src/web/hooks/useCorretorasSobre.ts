import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export interface CorretoraSobre {
  id: string;
  nome: string;
  whatsapp: string | null;
  creci: string | null;
  foto_url: string | null;
  auth_user_id: string | null;
}

export function useCorretorasSobre() {
  const [corretoras, setCorretoras] = useState<CorretoraSobre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCorretoras = async () => {
      try {
        const { data, error } = await supabase
          .from("corretoras")
          .select("id, nome, whatsapp, creci, foto_url")
          .order("nome", { ascending: true });

        if (error) throw error;
        
        // Fallback para imagens locais se não tiver foto_url
        const FALLBACK_IMAGES: Record<string, string> = {
          "Liliane de Lima Texeira": "/images/team/liliane.png",
          "Liliane de Lima Teixeira": "/images/team/liliane.png",
          "Marilza Galante": "/images/team/marilza.png",
          "Silvana Garcia": "/images/team/silvana.png",
        };

        const corretorasComFoto = (data ?? []).map(c => ({
          ...c,
          foto_url: c.foto_url || (c.nome && FALLBACK_IMAGES[c.nome] ? FALLBACK_IMAGES[c.nome] : null)
        }));

        setCorretoras(corretorasComFoto);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCorretoras();
  }, []);

  return { corretoras, loading, error };
}