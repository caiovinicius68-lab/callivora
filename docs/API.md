# API do CalLivora

## Health

```http
GET /health
```

## Chat

```http
POST /api/chat
Content-Type: application/json

{
  "message": "Quero prospectar restaurantes pelo Instagram",
  "context": "Cidade: Goiânia; oferta: landing page"
}
```

Resposta:

```json
{
  "text": "..."
}
```

## Plano

```http
POST /api/plan
Content-Type: application/json

{
  "business": "landing pages",
  "city": "Brasília",
  "channel": "Google Maps e Instagram",
  "goal": "marcar reuniões"
}
```

## Pesquisa

```http
POST /api/research
Content-Type: application/json

{
  "segment": "restaurantes",
  "city": "São Paulo",
  "avatar": "restaurantes com Instagram fraco"
}
```

## MCP HTTP

```http
POST /mcp
Content-Type: application/json
```

Exemplo:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

Chamada de ferramenta:

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "prospecting_plan",
    "arguments": {
      "business": "social media",
      "city": "Campinas",
      "channel": "Instagram",
      "goal": "fechar clientes mensais"
    }
  }
}
```
