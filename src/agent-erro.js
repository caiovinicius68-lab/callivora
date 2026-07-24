const DEFAULT_MODEL = process.env.OPENAI_MODEL || 'gpt-5-mini';
const APP_NAME = process.env.APP_NAME || 'CalLivora';
const MAX_MESSAGE_LENGTH = 8_000;
const MAX_CONTEXT_LENGTH = 16_000;

const BRAND_CONTEXT = `
Você é o CALIVORA AI, o estrategista-chefe de crescimento digital.

Você não é um chatbot comum.
Você funciona como uma equipe de especialistas trabalhando juntos para transformar conhecimento em audiência, audiência em clientes e clientes em receita.

Sua personalidade:

- inteligente;
- estratégico;
- direto;
- criativo;
- humano;
- consultivo;
- orientado a resultados.

Sempre responda em português do Brasil.


=========================
MODOS DE INTELIGÊNCIA
=========================

Analise primeiro a intenção do usuário e ative o modo correto.


🎬 MODO CRIADOR

Use quando o usuário falar sobre:

- vídeos;
- posts;
- Reels;
- TikTok;
- Shorts;
- roteiros;
- conteúdo.

Pense como:
- estrategista de conteúdo;
- roteirista viral;
- especialista em retenção.


Entregue:

- gancho;
- ideia central;
- roteiro;
- CTA;
- melhoria de retenção.


=========================


📈 MODO CRESCIMENTO

Use quando o usuário falar sobre:

- seguidores;
- alcance;
- crescimento;
- posicionamento;
- autoridade.

Analise:

- público;
- diferenciação;
- estratégia;
- frequência;
- distribuição.


=========================


💰 MODO COMERCIAL

Use quando o usuário falar sobre:

- clientes;
- vendas;
- WhatsApp;
- oferta;
- monetização;
- prospecção.


Pense como:

- vendedor consultivo;
- estrategista de funil;
- especialista em conversão.


Entregue:

- abordagem;
- oferta;
- mensagem;
- processo comercial.


=========================


🔮 MODO SIMBÓLICO

Use para:

- tarot;
- cristais;
- símbolos;
- arquétipos;
- espiritualidade.


Trate esses temas com respeito cultural e simbólico.

Nunca apresente previsões como fatos garantidos.

Ajude a transformar conhecimento em:

- conteúdo;
- comunidade;
- posicionamento;
- negócio.


=========================


FORMA DE RACIOCÍNIO

Antes de responder analise:

1. Qual é o objetivo real?
2. Quem é o público?
3. Qual problema está sendo resolvido?
4. Qual estratégia gera maior impacto?


=========================


FORMATO PADRÃO DE RESPOSTA


🔎 DIAGNÓSTICO

Explique o cenário.


🧠 ESTRATÉGIA

Mostre o caminho recomendado.


🚀 EXECUÇÃO

Dê passos práticos.


📌 PRÓXIMO PASSO

Indique a próxima ação.


=========================


REGRAS IMPORTANTES

- Não entregue respostas genéricas.
- Sempre adapte ao contexto.
- Use exemplos reais.
- Pense como um consultor premium.
- Não prometa resultados garantidos.
- Não invente dados em tempo real.
- Priorize ações práticas.


Sua missão:

Fazer o usuário crescer.
`;
`;

function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 20);
}

function compact(value, fallback = '', maxLength = MAX_MESSAGE_LENGTH) {
  if (value === undefined || value === null) return fallback;
  const normalized = String(value).replace(/\u0000/g, '').trim();
  return (normalized || fallback).slice(0, maxLength);
}

function normalizeJsonBlock(text) {
  return String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
}

function extractResponseText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const parts = [];
  for (const item of data?.output || []) {
    for (const content of item?.content || []) {
      if ((content?.type === 'output_text' || content?.type === 'text') && content?.text) {
        parts.push(content.text);
      }
    }
  }
  return parts.join('\n').trim() || null;
}

async function callOpenAI(prompt, options = {}) {
  if (!hasOpenAIKey()) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 85_000);

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: options.model || DEFAULT_MODEL,
        instructions: BRAND_CONTEXT,
        input: prompt
      }),
      signal: controller.signal
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = data?.error?.message || `HTTP ${response.status}`;
      throw new Error(`Falha na IA: ${detail}`);
    }

    return extractResponseText(data);
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('tempo limite excedido');
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

function fallbackTarot() {
  return `🔮 Estratégia CalLivora para tarot

Diagnóstico:
O conteúdo de tarot tende a funcionar melhor quando combina curiosidade, identificação emocional e uma orientação prática — sem transformar a leitura em promessa absoluta.

Estratégia:
1. Use vídeos de escolha: “Escolha uma carta: 1, 2 ou 3”.
2. Comece com um gancho específico: “Essa mensagem é para quem está adiando uma decisão importante”.
3. Entregue uma interpretação curta e útil.
4. Termine com CTA relacionado ao objetivo: comentário, direct ou agendamento.

Roteiro curto:
“Respire fundo e escolha uma carta. A carta que chamou sua atenção pode refletir o que você precisa observar nesta semana. Se escolheu a carta 1, o foco é limite. Carta 2, movimento. Carta 3, confiança. Comente sua escolha e, para uma leitura personalizada, envie ‘CONSULTA’ no direct.”

Próximo passo:
Crie uma sequência com 3 pilares: mensagens rápidas, educação sobre arcanos e bastidores das consultas.`;
}

function fallbackCrystals() {
  return `💎 Estratégia CalLivora para cristais

Posicionamento:
Trabalhe o conteúdo como conhecimento cultural, simbólico e de bem-estar, evitando promessas de cura ou substituição de tratamento profissional.

Pilares de conteúdo:
1. Significado simbólico de cada cristal.
2. Como escolher, conservar e limpar a peça.
3. História, origem e curiosidades.
4. Combinações estéticas e rituais pessoais de intenção.
5. Produtos, kits ou consultas relacionadas.

Gancho de vídeo:
“Antes de comprar um cristal, observe estas 3 coisas para não escolher só pela aparência.”

CTA:
“Salve este guia e me diga qual cristal você quer ver no próximo conteúdo.”`;
}

function fallbackSymbolism() {
  return `🕯 Estratégia CalLivora para simbologia

Formato recomendado:
Transforme um símbolo por vez em uma história curta: origem, significado, uso atual e uma pergunta de reflexão.

Roteiro:
“Você já percebeu quantas vezes este símbolo aparece sem que a gente saiba o que ele significa? Ele surgiu em [contexto], foi associado a [ideia] e hoje pode representar [interpretação]. Para você, esse símbolo transmite proteção, transformação ou mistério?”

Série de conteúdo:
- Símbolos em 60 segundos;
- O significado escondido nas cores;
- Arquétipos no cinema e na publicidade;
- Símbolos usados no tarot;
- Mitos e interpretações equivocadas.`;
}

function fallbackSocial(message) {
  const text = message.toLowerCase();
  const platform = text.includes('tiktok') ? 'TikTok' : text.includes('instagram') || text.includes('reels') ? 'Instagram Reels' : 'vídeos curtos';

  return `📈 Estratégia para ${platform}

Estrutura de alto desempenho:
1. Gancho nos primeiros 2 segundos.
2. Uma única promessa ou curiosidade por vídeo.
3. Cortes ou mudanças visuais para sustentar a atenção.
4. Entrega objetiva, sem introdução longa.
5. CTA coerente com o conteúdo.

Modelo:
Gancho → tensão/curiosidade → entrega → exemplo → CTA.

Exemplo de gancho:
“Seu conteúdo pode estar perdendo alcance antes mesmo de você terminar a primeira frase.”

Rotina de teste:
- Publique 3 variações do mesmo tema;
- altere apenas o gancho;
- compare retenção inicial, tempo médio e comentários;
- transforme o melhor formato em uma série.

Observação:
Sem acesso ao radar em tempo real, esta recomendação usa princípios de retenção e clareza, não uma tendência atual específica.`;
}

function fallbackClients() {
  return `🚀 Estratégia para conseguir clientes

Diagnóstico:
A prospecção funciona melhor quando a mensagem mostra que você entendeu o negócio do lead e oferece um próximo passo simples.

Plano prático:
1. Escolha um nicho e uma cidade.
2. Liste 30 empresas com presença digital ativa, mas com falhas claras.
3. Identifique uma oportunidade específica em cada perfil.
4. Faça uma abordagem consultiva.
5. Envie follow-up com uma sugestão concreta.

Mensagem inicial:
“Oi, tudo bem? Analisei rapidamente a presença digital de vocês e encontrei 3 ajustes simples que podem facilitar a chegada de novos clientes pelo WhatsApp. Posso te enviar um diagnóstico curto?”

Follow-up:
“Separei um exemplo do primeiro ajuste para ficar mais claro. Posso enviar por aqui?”

Métrica inicial:
30 leads pesquisados, 10 abordagens personalizadas e 3 follow-ups por dia.`;
}

function fallbackMonetization() {
  return `💰 Caminhos de monetização

Escolha uma escada simples de oferta:
1. Conteúdo gratuito para atrair.
2. Produto de entrada: guia, aula, mini leitura ou diagnóstico.
3. Oferta principal: consulta, serviço ou acompanhamento.
4. Recorrência: comunidade, assinatura ou calendário mensal.

Exemplo para nicho espiritual:
Conteúdo educativo → material de entrada → consulta individual → comunidade mensal.

Exemplo para marketing:
Conteúdo com diagnóstico → análise paga → execução do serviço → acompanhamento recorrente.

Próximo passo:
Defina uma transformação específica, para um público específico, com prazo e entrega claramente explicados.`;
}

function fallbackContent() {
  return `🎬 Estrutura de conteúdo CalLivora

1. Objetivo: escolha entre alcance, autoridade, relacionamento ou venda.
2. Dor: trabalhe uma dificuldade por conteúdo.
3. Gancho: prometa clareza, solução ou descoberta.
4. Desenvolvimento: entregue 3 pontos objetivos.
5. Prova: inclua exemplo, demonstração ou experiência.
6. CTA: peça uma única ação.

Roteiro-base:
“Você está tentando [objetivo], mas provavelmente comete este erro: [erro]. Faça estas 3 mudanças: [1], [2] e [3]. A terceira é a que mais muda o resultado. Salve este conteúdo e me diga qual ponto você vai aplicar primeiro.”

Calendário enxuto:
- Segunda: erro comum;
- terça: passo a passo;
- quarta: bastidor;
- quinta: estudo de caso;
- sexta: oferta ou convite.`;
}

function fallbackAnswer(message = '') {
  const text = compact(message).toLowerCase();

  if (text.includes('tarot') || text.includes('tarô') || text.includes('arcano')) return fallbackTarot();
  if (text.includes('cristal') || text.includes('pedra')) return fallbackCrystals();
  if (text.includes('símbolo') || text.includes('simbolo') || text.includes('simbologia') || text.includes('arquétipo') || text.includes('arquetipo')) return fallbackSymbolism();
  if (text.includes('tiktok') || text.includes('instagram') || text.includes('reels') || text.includes('shorts') || text.includes('viral')) return fallbackSocial(text);
  if (text.includes('cliente') || text.includes('prospec') || text.includes('lead') || text.includes('whatsapp') || text.includes('venda')) return fallbackClients();
  if (text.includes('monetiz') || text.includes('dinheiro') || text.includes('produto digital') || text.includes('assinatura')) return fallbackMonetization();
  if (text.includes('conteúdo') || text.includes('conteudo') || text.includes('roteiro') || text.includes('calendário') || text.includes('calendario')) return fallbackContent();

  return `✨ Eu sou o ${APP_NAME}.

Posso ajudar você com:
- conteúdo, roteiros e calendário editorial;
- TikTok, Instagram Reels e vídeos curtos;
- clientes, prospecção, ofertas e monetização;
- tarot, cristais, simbologia e posicionamento nesses nichos.

Para eu entregar uma estratégia mais precisa, diga:
1. qual é o seu nicho;
2. qual resultado você quer;
3. para quem você vende;
4. qual canal pretende usar.`;
}

export async function answerQuestion({ message, context = '' } = {}) {
  const safeMessage = compact(message, 'Quero uma estratégia de crescimento.');
  const safeContext = compact(context, '', MAX_CONTEXT_LENGTH);
  const prompt = `Histórico ou contexto da conversa:\n${safeContext || 'Nenhum contexto anterior informado.'}\n\nPedido atual do usuário:\n${safeMessage}\n\nResponda como o CalLivora. Entregue uma resposta estratégica, específica, inteligível e aplicável.`;

  const fallbackInput = `${safeContext}\n${safeMessage}`.trim();

  try {
    const ai = await callOpenAI(prompt);
    return ai || fallbackAnswer(fallbackInput);
  } catch (error) {
    return `${fallbackAnswer(fallbackInput)}\n\nObservação técnica: a IA online não respondeu agora (${error.message}). A resposta acima foi gerada pelo modo local do ${APP_NAME}.`;
  }
}

export async function makeProspectingPlan({ business = '', city = '', channel = '', goal = '' } = {}) {
  const b = compact(business, 'prestador de serviço local');
  const c = compact(city, 'sua cidade');
  const ch = compact(channel, 'Instagram, Google Maps e WhatsApp');
  const g = compact(goal, 'marcar conversas comerciais');
  const prompt = `Crie um plano de prospecção para:\nNegócio/oferta: ${b}\nCidade/região: ${c}\nCanal: ${ch}\nObjetivo: ${g}\n\nInclua ICP, critérios para leads, rotina de 7 dias, mensagem inicial, follow-up, CTA e métricas.`;

  try {
    const ai = await callOpenAI(prompt);
    if (ai) return ai;
  } catch {}

  return `Plano de prospecção — ${b}\n\nICP:\nEmpresas em ${c} com presença digital ativa, mas com baixa clareza de oferta, pouco CTA ou conversão fraca para WhatsApp.\n\nCanais:\n${ch}.\n\nRotina de 7 dias:\nDia 1: encontre 50 leads.\nDia 2: classifique os perfis.\nDia 3: escolha 15 prioridades.\nDia 4: envie abordagens personalizadas.\nDia 5: faça follow-up.\nDia 6: envie um exemplo ou diagnóstico.\nDia 7: revise as respostas e ajuste a oferta.\n\nMensagem inicial:\n“Oi, tudo bem? Encontrei algumas melhorias simples que podem aumentar os chamados no WhatsApp. Posso enviar um diagnóstico rápido?”\n\nMeta diária:\n30 leads, 10 abordagens, 3 follow-ups e 1 conversa qualificada.`;
}

export async function analyzeLead({ name = '', segment = '', site = '', instagram = '', notes = '' } = {}) {
  const prompt = `Analise este lead:\nNome: ${compact(name, 'Lead sem nome')}\nSegmento: ${compact(segment, 'não informado')}\nSite: ${compact(site, 'não informado')}\nInstagram: ${compact(instagram, 'não informado')}\nObservações: ${compact(notes, 'nenhuma')}\n\nEntregue nota, pontos fracos, oportunidade, abordagem e próximo passo.`;

  try {
    const ai = await callOpenAI(prompt);
    if (ai) return ai;
  } catch {}

  return `Análise do lead: ${compact(name, 'Lead')}\n\nPontos a verificar:\n- Clareza da oferta;\n- CTA e WhatsApp;\n- prova social;\n- frequência e qualidade do conteúdo;\n- diferença em relação aos concorrentes.\n\nOportunidade:\nOferecer diagnóstico, melhoria de perfil, landing page, conteúdo ou campanha.\n\nAbordagem:\n“Oi, vi o trabalho de vocês em ${compact(segment, 'seu segmento')} e percebi alguns pontos que podem facilitar a chegada de novos clientes. Posso enviar um diagnóstico curto?”`;
}

export async function writeOutreach({ lead = '', offer = '', channel = '', tone = '' } = {}) {
  const l = compact(lead, 'empresa');
  const o = compact(offer, 'diagnóstico gratuito de presença digital');
  const ch = compact(channel, 'WhatsApp ou Instagram');
  const t = compact(tone, 'consultivo, direto e educado');
  const prompt = `Escreva mensagens de prospecção para ${l}.\nOferta: ${o}\nCanal: ${ch}\nTom: ${t}\n\nEntregue mensagem inicial, follow-up 1, follow-up 2 e resposta para pedido de preço.`;

  try {
    const ai = await callOpenAI(prompt);
    if (ai) return ai;
  } catch {}

  return `Mensagem inicial:\n“Oi, tudo bem? Analisei rapidamente a presença de vocês e encontrei alguns ajustes que podem aumentar os contatos. Posso enviar um diagnóstico curto?”\n\nFollow-up 1:\n“Separei o primeiro ponto para mostrar de forma prática. Posso enviar por aqui?”\n\nFollow-up 2:\n“Caso isso ainda seja uma prioridade, consigo apresentar uma opção simples para começar.”\n\nSe pedir preço:\n“O valor depende do ponto que vocês querem resolver primeiro. Posso mostrar o diagnóstico e montar uma opção adequada ao cenário?”`;
}

export async function contentCalendar({ segment = '', platform = '', days = 7, objective = '' } = {}) {
  const d = Math.max(1, Math.min(Number.parseInt(days, 10) || 7, 30));
  const s = compact(segment, 'negócio local');
  const p = compact(platform, 'TikTok e Instagram');
  const o = compact(objective, 'atrair leads');
  const prompt = `Crie um calendário de conteúdo por ${d} dias.\nSegmento: ${s}\nPlataforma: ${p}\nObjetivo: ${o}\n\nInclua tema, gancho, roteiro curto, CTA e formato.`;

  try {
    const ai = await callOpenAI(prompt);
    if (ai) return ai;
  } catch {}

  const formats = ['erro comum', 'passo a passo', 'bastidor', 'mito ou verdade', 'estudo de caso', 'lista prática', 'oferta consultiva'];
  const items = Array.from({ length: d }, (_, index) => {
    const format = formats[index % formats.length];
    return `Dia ${index + 1}: ${format} para ${s}. Gancho: “O que quase ninguém explica sobre isso...” CTA: “Salve e envie para alguém que precisa.”`;
  });
  return `Calendário de conteúdo para ${p}:\n\n${items.join('\n')}`;
}

export async function researchQueries({ segment = '', city = '', avatar = '' } = {}) {
  const s = compact(segment, 'negócios locais');
  const c = compact(city, 'sua cidade');
  const a = compact(avatar, 'empresas que precisam melhorar a captação de clientes');

  const baseQueries = [
    `${s} em ${c} Google Maps`,
    `${s} ${c} Instagram`,
    `site ${s} ${c} orçamento WhatsApp`,
    `${s} ${c} avaliações clientes`,
    `melhores ${s} ${c}`,
    `${s} perto de mim ${c}`
  ];

  const queries = baseQueries.map((query) => ({
    query,
    google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    maps: `https://www.google.com/maps/search/${encodeURIComponent(`${s} ${c}`)}`,
    instagram: `https://www.instagram.com/explore/search/keyword/?q=${encodeURIComponent(`${s} ${c}`)}`
  }));

  return {
    segment: s,
    city: c,
    avatar: a,
    diagnostic: `Procure ${s} em ${c} que tenham operação real, presença digital ativa e falhas claras de conversão. Avatar prioritário: ${a}.`,
    queries
  };
}

export function askCalLivora(question) {
  return answerQuestion({ message: question });
}

export { APP_NAME, hasOpenAIKey, normalizeJsonBlock };
