import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export interface Corretora {
  id: string;
  nome: string;
  whatsapp: string | null;
  email: string | null;
  creci: string | null;
  foto_url: string | null;
  auth_user_id: string | null;
}

export function useCorretoraCompleta() {
  const { session } = useAuth();
  const [corretora, setCorretora] = useState<Corretora | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    supabase
      .from("corretoras")
      .select("id, nome, whatsapp, email, creci, foto_url, auth_user_id")
      .eq("auth_user_id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError("Erro ao buscar corretora: " + error.message);
        } else if (data) {
          setCorretora(data);
        }
        setLoading(false);
      });
  }, [session]);

  return { corretora, loading, error };
}

export async function uploadCorretoraFoto(
  file: File,
  corretoraId: string
): Promise<{ url: string | null; error: string | null }> {
  const fileExt = file.name.split(".").pop();
  const fileName = `${corretoraId}-${Date.now()}.${fileExt}`;
  const filePath = `${corretoraId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("corretoras-fotos")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    return { url: null, error: uploadError.message };
  }

  const { data } = supabase.storage
    .from("corretoras-fotos")
    .getPublicUrl(filePath);

  return { url: data.publicUrl, error: null };
}

export async function atualizarCorretoraFoto(
  corretoraId: string,
  fotoUrl: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("corretoras")
    .update({ foto_url: fotoUrl })
    .eq("id", corretoraId);

  return { error: error?.message ?? null };
}

export async function removerCorretoraFoto(
  corretoraId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from("corretoras")
    .update({ foto_url: null })
    .eq("id", corretoraId);

  return { error: error?.message ?? null };
}