import { Hono } from 'hono';

const app = new Hono();
app.get('/rpc/ping', (c) => c.json({ status: 'ok' }));
app.get('/rpc/properties.list', (c) => c.json([]));

export const config = { runtime: 'edge' };
export default app;