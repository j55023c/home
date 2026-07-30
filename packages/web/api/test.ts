export const config = { runtime: 'nodejs18.x' };

export default async function handler(request: Request) {
  return new Response(JSON.stringify({ ok: true, msg: 'test works' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}