export const config = { runtime: 'edge' };

export default async function handler(request: Request) {
  return new Response(JSON.stringify({ message: `Pong! ${Date.now()}` }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}