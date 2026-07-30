export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  return new Response(JSON.stringify({ ok: true, path: new URL(request.url).pathname }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}