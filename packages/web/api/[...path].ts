// Vercel Serverless Function — ponte entre o roteamento de arquivo da Vercel
// (api/[...path].ts, captura tudo em /api/*) e o app Hono/oRPC já existente
// em src/api/index.ts. Nenhuma rota é duplicada aqui: só delega.
//
// Runtime edge porque o driver do Turso (@libsql/client) fala HTTP e é
// compatível com edge — evita cold start de função Node completa.
import { handle } from "hono/vercel";
import app from "../src/api/index";

export const config = {
  runtime: "edge",
};

export default handle(app);