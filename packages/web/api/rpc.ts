import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.replace('/api/rpc/', '');
  
  if (path === 'ping') {
    return new Response(JSON.stringify({ message: `Pong! ${Date.now()}` }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (path === 'properties.list') {
    const { data, error } = await supabase
      .from('imoveis')
      .select('*')
      .eq('publicado', true)
      .order('created_at', { ascending: false });
    
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify(data || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}