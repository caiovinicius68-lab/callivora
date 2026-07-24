const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';
const APP_NAME = process.env.APP_NAME || 'CalLivora';

const BRAND_CONTEXT = `
Você é o ${APP_NAME}, um agente de inteligência comercial para prospecção, marketing e conteúdo.
Seu foco é ajudar empreendedores, social medias, afiliados, prestadores de serviço e pequenas empresas a encontrar clientes e vender melhor.
Você responde em português do Brasil, direto ao ponto, com estratégia prática, scripts copiáveis e próximos passos claros.
Domínios fortes: prospecção B2B, prospecção local, Google Maps, Instagram, TikTok, Facebook, WhatsApp, copywriting, funil simples, oferta, diagnóstico comercial e calendário de conteúdo.
Quando o usuário pedir algo amplo, entregue um plano objetivo com canais, mensagens, rotina diária e critérios de priorização.
Não prometa resultados garantidos. Não invente dados externos em tempo real. Se precisar de pesquisa externa, gere consultas e método de validação.
`;

function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 20);
}

function compact(value, fallback = '') {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function normalizeJsonBlock(text) {
  return String(text || '')
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```$/i, '')
    .trim();
}

async function callOpenAI(prompt, options = {}) {
  if (!hasOpenAIKey()) return null;

  const body = {
    model: options.model || DEFAULT_MODEL,
    input: [
      {
        role: 'system',
        content: BRAND_CONTEXT
      },
      {
        role: 'user',
        content: prompt
      }
    ]
  };

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = data?.error?.message || `HTTP ${response.status}`;
    throw new Error(`Falha na IA: ${detail}`);
  }

  if (typeof data.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const output = data.output || [];
  const parts = [];
  for (const item of output) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) parts.push(content.text);
      if (content.type === 'text' && content.text) parts.push(content.text);
    }
  }
  return parts.join('\n').trim() || null;
}

function fallbackAnswer(message = '') {
  const text = message.toLowerCase();

  if (text.includes('tiktok') || text.includes('reels') || text.includes('vídeo') || text.includes('video')) {
    return `Plano rápido do ${APP_NAME} para conteúdo curto:\n\n1. Escolha uma dor única do cliente: falta de cliente, baixa procura, Instagram parado ou anúncio que não vende.\n2. Grave 3 formatos por semana: antes/depois, erro comum e bastidor/diagnóstico.\n3. Use gancho nos 3 primeiros segundos: “Seu Instagram parece bonito, mas não vende por isso...”\n4. Feche com CTA simples: “Me chama com a palavra DIAGNÓSTICO que eu te mostro 3 melhorias.”\n5. Reaproveite o mesmo vídeo no TikTok, Reels e Shorts.\n\nScript pronto:\n“Se você tem uma empresa local e posta todo dia, mas ninguém chama no WhatsApp, o problema não é frequência. É oferta fraca, perfil confuso e falta de prova. Eu analiso seu perfil e te mostro onde está vazando cliente. Me chama com DIAGNÓSTICO.”`;
  }

  if (text.includes('instagram')) {
    return `Estratégia de Instagram para prospecção:\n\n1. Procure empresas locais com bio fraca, destaques bagunçados e posts sem CTA.\n2. Salve 30 perfis por dia em uma planilha simples.\n3. Interaja antes de chamar: curta 2 posts, veja stories e responda algo real.\n4. Envie uma abordagem consultiva, sem parecer spam.\n\nMensagem pronta:\n“Oi, vi o perfil de vocês e percebi 3 pontos simples que podem aumentar os chamados no WhatsApp: bio, destaque de serviços e CTA nos posts. Posso te mandar um diagnóstico rápido em vídeo?”`;
  }

  if (text.includes('facebook') || text.includes('meta ads') || text.includes('anúncio') || text.includes('ads')) {
    return `Estratégia de Facebook/Meta para captar clientes:\n\n1. Oferta simples: diagnóstico gratuito, orçamento rápido ou landing page de demonstração.\n2. Público inicial: cidade + raio + interesses do segmento.\n3. Criativo: dor clara + prova + promessa realista.\n4. Conversão: WhatsApp com pergunta de qualificação.\n\nCopy base:\n“Sua empresa aparece, mas não recebe pedidos? Eu monto uma página simples para transformar visitantes em contatos no WhatsApp. Peça um diagnóstico gratuito.”`;
  }

  return `Sou o ${APP_NAME}. Posso te ajudar com prospecção, marketing, TikTok, Instagram, Facebook, WhatsApp, scripts de abordagem e planos comerciais.\n\nComece assim:\n1. Defina o nicho que quer atacar.\n2. Escolha uma cidade ou região.\n3. Liste 30 empresas com presença digital fraca.\n4. Monte uma melhoria visual rápida ou diagnóstico.\n5. Aborde com uma mensagem consultiva.\n\nModelo de abordagem:\n“Oi, tudo bem? Vi o perfil/site de vocês e percebi algumas oportunidades simples para gerar mais contatos pelo WhatsApp. Posso te mandar um diagnóstico rápido com 3 melhorias?”`;
}

export async function answerQuestion({ message, context = '' } = {}) {
  const safeMessage = compact(message, 'Quero prospectar clientes.');
  const safeContext = compact(context);
  const prompt = `Contexto adicional: ${safeContext || 'nenhum'}\n\nPergunta do usuário:\n${safeMessage}\n\nResponda com estratégia prática, scripts e próximos passos.`;

  try {
    const ai = await callOpenAI(prompt);
    return ai || fallbackAnswer(safeMessage);
  } catch (error) {
    return `${fallbackAnswer(safeMessage)}\n\nObservação técnica: a IA online não respondeu agora (${error.message}). A resposta acima foi gerada pelo modo local do ${APP_NAME}.`;
  }
}

export async function makeProspectingPlan({ business = '', city = '', channel = '', goal = '' } = {}) {
  const b = compact(business, 'prestador de serviço local');
  const c = compact(city, 'sua cidade');
  const ch = compact(channel, 'Instagram, Google Maps e WhatsApp');
  const g = compact(goal, 'marcar conversas comerciais');
  const prompt = `Crie um plano de prospecção para:\nNegócio/oferta: ${b}\nCidade/região: ${c}\nCanal: ${ch}\nObjetivo: ${g}\n\nInclua: ICP, critérios para escolher leads, rotina de 7 dias, mensagem inicial, follow-up, CTA e métrica diária.`;

  try {
    const ai = await callOpenAI(prompt);
    if (ai) return ai;
  } catch {}

  return `Plano de prospecção — ${b}\n\nICP:\nEmpresas em ${c} com presença digital fraca, baixa clareza de oferta, pouco CTA e provável necessidade de gerar contatos pelo WhatsApp.\n\nCanais principais:\n${ch}.\n\nRotina de 7 dias:\nDia 1: encontre 50 leads no Google Maps e Instagram.\nDia 2: classifique por nota: perfil, site, bio, CTA, prova social e frequência.\nDia 3: escolha 15 leads prioritários e crie diagnóstico rápido.\nDia 4: envie abordagem consultiva.\nDia 5: faça follow-up com uma melhoria específica.\nDia 6: envie exemplo visual, landing page simples ou roteiro de melhoria.\nDia 7: revise respostas, ajuste nicho e repita.\n\nMensagem inicial:\n“Oi, tudo bem? Vi a presença digital de vocês e percebi algumas melhorias simples que podem aumentar os chamados no WhatsApp. Posso te mandar um diagnóstico rápido com 3 pontos?”\n\nFollow-up:\n“Passando só para complementar: o ponto que mais chama atenção é que a oferta não está clara nos primeiros segundos. Posso te mostrar como eu ajustaria?”\n\nMétrica diária:\n30 leads encontrados, 10 abordagens, 3 follow-ups, 1 conversa qualificada.`;
}

export async function analyzeLead({ name = '', segment = '', site = '', instagram = '', notes = '' } = {}) {
  const prompt = `Analise este lead para prospecção:\nNome: ${compact(name, 'Lead sem nome')}\nSegmento: ${compact(segment, 'não informado')}\nSite: ${compact(site, 'não informado')}\nInstagram: ${compact(instagram, 'não informado')}\nObservações: ${compact(notes, 'nenhuma')}\n\nDê uma nota de 0 a 10, pontos fracos prováveis, oportunidade de venda, abordagem personalizada e próximo passo.`;

  try {
    const ai = await callOpenAI(prompt);
    if (ai) return ai;
  } catch {}

  return `Análise do lead: ${compact(name, 'Lead')}\n\nNota estimada: 7/10, se houver presença digital fraca e canal de WhatsApp pouco explorado.\n\nPontos a verificar:\n- Bio ou descrição deixa claro o que vende?\n- Existe botão de WhatsApp visível?\n- O site carrega rápido e tem CTA?\n- Os posts mostram prova social ou só conteúdo genérico?\n- O lead parece ativo, mas sem estratégia comercial?\n\nOportunidade:\nOferecer diagnóstico de presença digital, landing page, melhoria de perfil ou campanha simples para WhatsApp.\n\nAbordagem:\n“Oi, vi o trabalho de vocês em ${compact(segment, 'seu segmento')} e percebi alguns pontos simples que podem facilitar a chegada de novos clientes pelo WhatsApp. Posso te mandar um diagnóstico rápido?”`;
}

export async function writeOutreach({ lead = '', offer = '', channel = '', tone = '' } = {}) {
  const l = compact(lead, 'empresa');
  const o = compact(offer, 'diagnóstico gratuito de presença digital');
  const ch = compact(channel, 'WhatsApp/Instagram');
  const t = compact(tone, 'consultivo, direto e educado');
  const prompt = `Escreva mensagens de prospecção para ${l}.\nOferta: ${o}\nCanal: ${ch}\nTom: ${t}\n\nEntregue: mensagem inicial, follow-up 1, follow-up 2 e resposta se a pessoa pedir preço.`;

  try {
    const ai = await callOpenAI(prompt);
    if (ai) return ai;
  } catch {}

  return `Mensagem inicial:\nOi, tudo bem? Vi a presença digital de vocês e percebi alguns pontos simples que podem aumentar os contatos pelo WhatsApp. Posso te mandar um diagnóstico rápido?\n\nFollow-up 1:\nPassando só para reforçar: não é uma proposta pronta, é um diagnóstico curto mostrando onde vocês podem melhorar para receber mais chamados. Quer que eu envie?\n\nFollow-up 2:\nSeparei 3 melhorias que eu faria no perfil/site de vocês. Se fizer sentido, posso te mandar em áudio ou vídeo rápido.\n\nSe pedir preço:\nDepende do que vocês querem resolver primeiro. Posso te mostrar o diagnóstico e, se fizer sentido, monto uma opção simples para começar sem complicar.`;
}

export async function contentCalendar({ segment = '', platform = '', days = 7, objective = '' } = {}) {
  const d = Number.parseInt(days, 10) || 7;
  const prompt = `Crie calendário de conteúdo por ${d} dias.\nSegmento: ${compact(segment, 'negócio local')}\nPlataforma: ${compact(platform, 'TikTok, Instagram e Facebook')}\nObjetivo: ${compact(objective, 'atrair leads')}\n\nInclua: tema, gancho, roteiro curto, CTA e formato.`;

  try {
    const ai = await callOpenAI(prompt);
    if (ai) return ai;
  } catch {}

  const items = [];
  for (let i = 1; i <= Math.min(d, 14); i++) {
    items.push(`Dia ${i}: Erro comum do cliente no segmento ${compact(segment, 'local')}. Gancho: “Você está perdendo clientes por causa disso...” CTA: “Me chama com DIAGNÓSTICO.”`);
  }
  return `Calendário de conteúdo:\n\n${items.join('\n')}`;
}

export async function researchQueries({ segment = '', city = '', avatar = '' } = {}) {
  const s = compact(segment, 'negócios locais');
  const c = compact(city, 'sua cidade');
  const a = compact(avatar, 'empresas que precisam vender mais pelo WhatsApp');

  const baseQueries = [
    `${s} em ${c} Google Maps`,
    `${s} ${c} Instagram`,
    `site ${s} ${c} orçamento WhatsApp`,
    `${s} ${c} avaliações clientes`,
    `melhores ${s} ${c}`,
    `${s} perto de mim ${c}`
  ];

  const links = baseQueries.map((query) => ({
    query,
    google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    maps: `https://www.google.com/maps/search/${encodeURIComponent(`${s} ${c}`)}`,
    instagram: `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(`${s} ${c}`)}`
  }));

  const diagnostic = `Pesquisa estratégica para ${s} em ${c}\n\nAvatar buscado:\n${a}\n\nComo escolher bons leads:\n1. Tem produto/serviço real e ticket que justifica investimento.\n2. Tem Instagram ou site fraco, confuso ou sem CTA.\n3. Tem avaliações, movimento ou prova de que já vende.\n4. Tem WhatsApp, mas pouca estrutura de conversão.\n5. O concorrente parece mais organizado digitalmente.\n\nAbordagem baseada na pesquisa:\n“Vi que vocês já têm presença e movimento em ${c}, mas percebi alguns pontos que podem facilitar a chegada de mais clientes pelo WhatsApp. Posso te mandar um diagnóstico rápido?”`;

  return {
    segment: s,
    city: c,
    avatar: a,
    diagnostic,
    queries: links
  };
}

export { APP_NAME, hasOpenAIKey, normalizeJsonBlock };
