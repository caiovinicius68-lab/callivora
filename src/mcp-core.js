import {
  answerQuestion,
  analyzeLead,
  contentCalendar,
  makeProspectingPlan,
  researchQueries,
  writeOutreach
} from './agent.js';

export const MCP_PROTOCOL_VERSION = '2025-06-18';

export const tools = [
  {
    name: 'callivora_chat',
    description: 'Responde perguntas sobre conteúdo, redes sociais, clientes, monetização, tarot, cristais e simbologia.',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Pergunta ou pedido do usuário.' },
        context: { type: 'string', description: 'Contexto opcional da conversa, negócio, nicho ou objetivo.' }
      },
      required: ['message']
    }
  },
  {
    name: 'prospecting_plan',
    description: 'Cria um plano de prospecção prático para nicho, cidade, canal e objetivo.',
    inputSchema: {
      type: 'object',
      properties: {
        business: { type: 'string' },
        city: { type: 'string' },
        channel: { type: 'string' },
        goal: { type: 'string' }
      }
    }
  },
  {
    name: 'lead_analyzer',
    description: 'Analisa um lead e cria uma abordagem personalizada.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        segment: { type: 'string' },
        site: { type: 'string' },
        instagram: { type: 'string' },
        notes: { type: 'string' }
      }
    }
  },
  {
    name: 'outreach_script',
    description: 'Gera mensagens de abordagem e follow-up.',
    inputSchema: {
      type: 'object',
      properties: {
        lead: { type: 'string' },
        offer: { type: 'string' },
        channel: { type: 'string' },
        tone: { type: 'string' }
      }
    }
  },
  {
    name: 'content_calendar',
    description: 'Cria calendário de conteúdo para redes sociais.',
    inputSchema: {
      type: 'object',
      properties: {
        segment: { type: 'string' },
        platform: { type: 'string' },
        days: { type: 'number' },
        objective: { type: 'string' }
      }
    }
  },
  {
    name: 'research_queries',
    description: 'Gera consultas e links para encontrar leads.',
    inputSchema: {
      type: 'object',
      properties: {
        segment: { type: 'string' },
        city: { type: 'string' },
        avatar: { type: 'string' }
      }
    }
  }
];

async function callTool(name, args = {}) {
  switch (name) {
    case 'callivora_chat':
      return answerQuestion(args);
    case 'prospecting_plan':
      return makeProspectingPlan(args);
    case 'lead_analyzer':
      return analyzeLead(args);
    case 'outreach_script':
      return writeOutreach(args);
    case 'content_calendar':
      return contentCalendar(args);
    case 'research_queries':
      return JSON.stringify(await researchQueries(args), null, 2);
    default:
      throw new Error(`Ferramenta desconhecida: ${name}`);
  }
}

function jsonRpcResult(id, result) {
  return { jsonrpc: '2.0', id, result };
}

function jsonRpcError(id, code, message, data) {
  const error = { code, message };
  if (data !== undefined) error.data = data;
  return { jsonrpc: '2.0', id: id ?? null, error };
}

export async function handleMcpRequest(message) {
  if (!message || typeof message !== 'object') {
    return jsonRpcError(null, -32600, 'Requisição JSON-RPC inválida.');
  }

  const { id, method, params = {} } = message;

  try {
    switch (method) {
      case 'initialize':
        return jsonRpcResult(id, {
          protocolVersion: MCP_PROTOCOL_VERSION,
          capabilities: { tools: {} },
          serverInfo: { name: 'callivora', version: '1.0.0' },
          instructions: 'Use o CalLivora para conteúdo, prospecção, marketing e estratégia.'
        });

      case 'notifications/initialized':
        return null;

      case 'ping':
        if (id === undefined || id === null) return null;
        return jsonRpcResult(id, {});

      case 'tools/list':
        return jsonRpcResult(id, { tools });

      case 'tools/call': {
        const text = await callTool(params?.name, params?.arguments || {});
        return jsonRpcResult(id, {
          content: [{ type: 'text', text: String(text) }]
        });
      }

      default:
        return jsonRpcError(id, -32601, `Método não encontrado: ${method}`);
    }
  } catch (error) {
    return jsonRpcError(id, -32000, error.message || 'Erro interno no MCP.');
  }
}
