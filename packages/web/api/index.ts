export const config = { runtime: 'nodejs' };

export default async function handler(request: Request) {
  const url = new URL(request.url);
  return new Response(JSON.stringify({ 
    ok: true, 
    path: url.pathname,
    method: request.method
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}