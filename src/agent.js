
const knowledge = {
  tarot: "Conhecimento sobre arcanos, tiragens, simbologia e interpretação como ferramenta de reflexão.",
  cristais: "Informações sobre cristais, história, simbolismos e usos tradicionais.",
  conteudo: "Estratégias de TikTok, Instagram, Reels, Shorts, roteiros e retenção.",
  vendas: "Estratégias de posicionamento, clientes, ofertas e crescimento."
};

export function askCalLivora(question) {
  const q = question.toLowerCase();

  if (q.includes("tarot") || q.includes("tarô")) {
    return "Para conteúdo de tarot, use ganchos fortes nos primeiros segundos, como: 'Escolha uma carta e veja a mensagem que apareceu para você'. Foque em retenção, comentários e conexão com o público.";
  }

  if (q.includes("tiktok") || q.includes("instagram")) {
    return "Analise formatos virais, copie estruturas que funcionam e adapte para sua identidade. Use gancho inicial, história curta e chamada para ação.";
  }

  return "Sou o CalLivora AI. Posso ajudar com estratégias de conteúdo, tendências, crescimento, clientes e conhecimento especializado.";
}
