import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Supabase não configurado: verifique as variáveis de ambiente SUPABASE_URL e SUPABASE_ANON_KEY no .env da raiz"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);