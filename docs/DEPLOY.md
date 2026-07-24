# Deploy do CalLivora

## Opção recomendada: Render

### Via Blueprint

O projeto já tem `render.yaml`.

Passos:

1. Crie um repositório GitHub.
2. Faça upload deste projeto.
3. No Render, escolha **New + > Blueprint**.
4. Selecione o repositório.
5. Configure `OPENAI_API_KEY`.
6. Clique em deploy.

### Via Web Service manual

Configuração:

```text
Runtime: Node
Build Command: npm install
Start Command: npm start
Environment: Node 20+
```

Variáveis:

```text
OPENAI_API_KEY=sua_chave
OPENAI_MODEL=gpt-5-mini
APP_NAME=CalLivora
```

URL final:

```text
https://seu-app.onrender.com
https://seu-app.onrender.com/mcp
```

## Docker

```bash
docker build -t callivora .
docker run -p 3000:3000 --env-file .env callivora
```

## Google Cloud Run

```bash
gcloud run deploy callivora \
  --source . \
  --region southamerica-east1 \
  --allow-unauthenticated \
  --set-env-vars APP_NAME=CalLivora,OPENAI_MODEL=gpt-5-mini
```

Depois adicione `OPENAI_API_KEY` com Secret Manager ou variável segura.

## Railway

1. New Project.
2. Deploy from GitHub.
3. Selecione o repositório.
4. Adicione `OPENAI_API_KEY`.
5. O Railway detecta Node e roda `npm start`.

## Produção sem autenticação

Este projeto está sem autenticação porque foi pedido assim. Para deixar público, cuidado:

- Qualquer pessoa com o link pode consumir sua API.
- Sua chave OpenAI pode gerar custos.
- Para vender acesso, adicione login, token, rate limit ou domínio privado.
