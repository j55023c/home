import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export function useCorretoraAtual() {
  const { session } = useAuth();
  const [corretoraId, setCorretoraId] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }

    supabase
      .from("corretoras")
      .select("id, nome, whatsapp")
      .eq("auth_user_id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Erro ao buscar corretora:", error.message);
        } else if (data) {
          setCorretoraId(data.id);
          setNome(data.nome);
          setWhatsapp(data.whatsapp);
        }
        setLoading(false);
      });
  }, [session]);

  return { corretoraId, nome, whatsapp, loading };
}
