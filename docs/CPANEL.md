# Rodar em hospedagem com cPanel/Node.js

Use apenas se sua hospedagem tiver **Setup Node.js App** ou suporte real a Node 20+.

## Passos gerais

1. Compacte o projeto.
2. Envie para o gerenciador de arquivos do cPanel.
3. Extraia em uma pasta, por exemplo: `callivora`.
4. No cPanel, abra **Setup Node.js App**.
5. Crie app com:

```text
Node version: 20+
Application root: callivora
Application startup file: src/server.js
```

6. Configure variáveis:

```text
OPENAI_API_KEY=sua_chave
OPENAI_MODEL=gpt-5-mini
APP_NAME=CalLivora
```

7. Rode `npm install` pelo painel ou terminal.
8. Reinicie a aplicação.

## Observação

Nem toda hospedagem cPanel suporta MCP remoto bem, porque algumas bloqueiam requisições longas ou headers personalizados. Para cloud profissional, prefira Render, Railway ou Cloud Run.
