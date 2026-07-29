import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Aviso claro em vez de erro silencioso caso o .env não esteja configurado
  console.error(
    "Supabase não configurado: verifique o arquivo .env (VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY)"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
