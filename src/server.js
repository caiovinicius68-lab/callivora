import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { answerQuestion, makeProspectingPlan, researchQueries } from './agent.js';
import { handleMcpRequest, tools } from './mcp-core.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const PORT = Number(process.env.PORT || 3000);

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

function send(res, statusCode, body, headers = {}) {
  const payload = typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': headers['Content-Type'] || 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Mcp-Session-Id',
    ...headers
  });
  res.end(payload);
}

async function readJson(req) {
  let body = '';
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 2_000_000) throw new Error('Payload muito grande.');
  }
  if (!body.trim()) return {};
  return JSON.parse(body);
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';

  const safePath = path.normalize(pathname).replace(/^\.+[\\/]/, '');
  const filePath = path.join(publicDir, safePath);

  if (!filePath.startsWith(publicDir) || !existsSync(filePath)) {
    send(res, 404, 'Página não encontrada.', { 'Content-Type': 'text/plain; charset=utf-8' });
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const content = await readFile(filePath);
  send(res, 200, content, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
}

async function router(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'OPTIONS') {
    send(res, 204, '');
    return;
  }

  try {
    if (url.pathname === '/health') {
      send(res, 200, {
        ok: true,
        app: process.env.APP_NAME || 'CalLivora',
        openai: Boolean(process.env.OPENAI_API_KEY),
        mcp: '/mcp',
        tools: tools.map((tool) => tool.name)
      });
      return;
    }

    if (url.pathname === '/api/chat' && req.method === 'POST') {
      const payload = await readJson(req);
      const text = await answerQuestion({ message: payload.message, context: payload.context });
      send(res, 200, { text });
      return;
    }

    if (url.pathname === '/api/plan' && req.method === 'POST') {
      const payload = await readJson(req);
      const text = await makeProspectingPlan(payload);
      send(res, 200, { text });
      return;
    }

    if (url.pathname === '/api/research' && req.method === 'POST') {
      const payload = await readJson(req);
      const result = await researchQueries(payload);
      send(res, 200, result);
      return;
    }

    if (url.pathname === '/mcp') {
      if (req.method === 'GET') {
        send(res, 200, {
          name: 'CalLivora MCP',
          endpoint: '/mcp',
          transport: 'HTTP JSON-RPC',
          tools: tools.map((tool) => ({ name: tool.name, description: tool.description }))
        });
        return;
      }

      if (req.method === 'POST') {
        const payload = await readJson(req);
        const response = Array.isArray(payload)
          ? await Promise.all(payload.map((item) => handleMcpRequest(item)))
          : await handleMcpRequest(payload);
        if (response === null) {
          send(res, 202, {});
        } else {
          send(res, 200, response, { 'Mcp-Session-Id': 'callivora-stateless' });
        }
        return;
      }
    }

    await serveStatic(req, res);
  } catch (error) {
    send(res, 500, {
      error: error.message || 'Erro interno',
      hint: 'Confira se o .env está configurado e se o payload enviado é JSON válido.'
    });
  }
}

const server = http.createServer(router);
server.listen(PORT, () => {
  console.log(`CalLivora online em http://localhost:${PORT}`);
  console.log(`MCP HTTP em http://localhost:${PORT}/mcp`);
});
