import { Hono } from 'hono';

const app = new Hono();
app.get('/hello', (c) => c.text('Hello World'));
app.get('/ping', (c) => c.json({ status: 'ok' }));

export const config = { runtime: 'edge' };
export default app;