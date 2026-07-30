import { handle } from 'hono/vercel';
import { Hono } from 'hono';
import app from '../src/api/index';

const edgeApp = new Hono();

// Test route to verify edge function is working
edgeApp.get('/edge-test', (c) => c.json({ ok: true, msg: 'edge function works' }));

// Mount the main app under /rpc
edgeApp.route('/rpc', app);

export const config = { runtime: 'edge' };
export default handle(edgeApp);