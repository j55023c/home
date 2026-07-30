import { handle } from 'hono/vercel';
import { Hono } from 'hono';
import app from '../src/api/index';

// Delegates all /api/* requests to the existing Hono/oRPC app.
export const config = { runtime: 'edge' };
export default handle(app);