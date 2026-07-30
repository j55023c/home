import { handle } from "hono/vercel";
const app = new (await import('hono')).Hono();
app.get('/hello', (c) => c.text('Hello from test'));
export const config = { runtime: "edge" };
export default handle(app);