# Rodar CalLivora no terminal

## Chat local

```bash
npm install
npm run cli
```

Comandos:

```text
/ajuda       Mostra opções
/plano       Gera plano de prospecção
/pesquisar   Gera buscas para encontrar leads
/sair        Sai do terminal
```

## MCP local

```bash
npm run mcp
```

Para cliente MCP local:

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

## Distribuição como comando único futuramente

Quando quiser transformar em `npx`, publique no npm:

```bash
npm login
npm publish --access public
```

Depois o usuário poderá rodar:

```bash
npx callivora
```

Ou MCP local:

```bash
npx callivora-mcp
```
