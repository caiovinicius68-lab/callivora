function answerQuestion(question) {
  const q = question.toLowerCase();

  if (q.includes("tarot") || q.includes("tarô")) {
    return `
🔮 Estratégia CalLivora:

Para crescer com tarot:
- Use vídeos de escolha ("Escolha uma carta")
- Comece com um gancho forte nos primeiros 3 segundos
- Gere curiosidade
- Termine com CTA para comentar

Exemplo:
"Essa carta apareceu para você por um motivo..."
`;
  }

  if (q.includes("tiktok") || q.includes("instagram")) {
    return `
📈 Estratégia de crescimento:

Analise vídeos virais do nicho.
Copie a estrutura, não o conteúdo.

Modelo:
Gancho → História → Entrega → CTA.

Teste vários formatos.
`;
  }

  return `
✨ Eu sou o CalLivora AI.

Posso ajudar com:
🔮 Tarot
💎 Cristais
🕯 Simbolismos
📱 TikTok
📸 Instagram
🎬 Conteúdo
🚀 Clientes
💰 Estratégias de venda
`;
}


function makeProspectingPlan(nicho) {
  return `
Plano de prospecção para ${nicho}:

1. Encontrar perfis ativos
2. Analisar conteúdo
3. Criar proposta personalizada
4. Apresentar oportunidade
`;
}


function researchQueries(topic) {
  return [
    `${topic} tendências TikTok`,
    `${topic} Instagram viral`,
    `${topic} melhores criadores`
  ];
}


function researchQueries(topic) {
  return [
    `${topic} tendências TikTok`,
    `${topic} Instagram viral`,
    `${topic} melhores criadores`
  ];
}


function askCalLivora(question) {
  return answerQuestion(question);
}


export {
  answerQuestion,
  makeProspectingPlan,
  researchQueries,
  askCalLivora
};