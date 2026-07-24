# CalLivora

CalLivora é um agente de inteligência comercial para prospecção, marketing e conteúdo.
Ele roda de três formas:

1. **Cloud/web**: interface roxa + API + MCP HTTP no mesmo servidor.
2. **Terminal**: chat interativo para prospecção.
3. **MCP local**: servidor MCP via stdio para clientes compatíveis.

> Sem autenticação por padrão, conforme solicitado. Se for vender para clientes, adicione autenticação antes de abrir publicamente.

## Botão Deploy to Render

Depois de subir este projeto em um repositório GitHub, troque `SEU_USUARIO/SEU_REPO` pelo seu repositório:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/SEU_USUARIO/SEU_REPO)

## Rodar localmente

```bash
cp .env.example .env
npm install
npm start
```

Abra:

```text
http://localhost:3000
```

Endpoints:

```text
GET  /health
POST /api/chat
POST /api/plan
POST /api/research
POST /mcp
```

## Variáveis de ambiente

```bash
OPENAI_API_KEY=sua_chave_aqui
OPENAI_MODEL=gpt-5-mini
PORT=3000
APP_NAME=CalLivora
```

Se não configurar `OPENAI_API_KEY`, o projeto continua funcionando com respostas locais e modelos prontos.

## Rodar no terminal

```bash
npm run cli
```

Comandos dentro do terminal:

```text
/ajuda
/plano
/pesquisar
/sair
```

## Rodar MCP local via stdio

```bash
npm run mcp
```

Exemplo de configuração local em cliente MCP:

```json
{
  "mcpServers": {
    "callivora": {
      "command": "node",
      "args": ["/CAMINHO/ABSOLUTO/callivora/src/mcp-stdio.js"]
    }
  }
}
```

## Usar MCP remoto na cloud

Depois do deploy:

```text
https://seu-app.onrender.com/mcp
```

Exemplo Claude Code:

```bash
claude mcp add --transport http callivora https://seu-app.onrender.com/mcp
```

## Ferramentas MCP disponíveis

- `callivora_chat`: responde perguntas amplas de prospecção e marketing.
- `prospecting_plan`: cria plano de prospecção.
- `lead_analyzer`: analisa lead.
- `outreach_script`: gera abordagem e follow-up.
- `content_calendar`: cria calendário de conteúdo.
- `research_queries`: gera pesquisas e links para achar leads.

## Deploy rápido no Render

1. Suba este projeto para um GitHub.
2. Clique no botão Deploy to Render ou crie um Web Service manual.
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Environment: Node 20+
4. Adicione `OPENAI_API_KEY` nas variáveis do Render.
5. Acesse a URL final.

## Estrutura

```text
src/
  agent.js          Núcleo do agente e chamadas OpenAI/fallback local
  server.js         Web + API + MCP HTTP
  mcp-core.js       Ferramentas MCP e JSON-RPC
  mcp-stdio.js      MCP local via stdio
  cli.js            Terminal interativo
public/
  index.html        Interface roxa
  styles.css        Design premium
  app.js            Ações da interface
docs/
  DEPLOY.md         Instruções de cloud
  TERMINAL.md       Uso no terminal
  CPANEL.md         Hospedagem Node/cPanel
```

## Observação técnica

Este pacote implementa MCP JSON-RPC para HTTP e stdio sem dependências externas, para facilitar deploy. Em produção avançada, você pode migrar para o SDK oficial do MCP se precisar de sessões complexas, streaming e recursos mais sofisticados.
