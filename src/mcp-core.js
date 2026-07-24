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
    description: 'Responde perguntas sobre prospecção, marketing, TikTok, Instagram, Facebook, WhatsApp, ofertas e vendas.',
    inputSchema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Pergunta ou pedido do usuário.' },
        context: { type: 'string', description: 'Contexto opcional do negócio, nicho, cidade ou objetivo.' }
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
        business: { type: 'string', description: 'Tipo de negócio/oferta.' },
        city: { type: 'string', description: 'Cidade ou região.' },
        channel: { type: 'string', description: 'Canal principal: Google Maps, Instagram, WhatsApp, TikTok, Facebook.' },
        goal: { type: 'string', description: 'Objetivo comercial.' }
      }
    }
  },
  {
    name: 'lead_analyzer',
    description: 'Analisa se um lead é bom para abordagem e cria uma mensagem personalizada.',
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
    description: 'Gera mensagens de abordagem e follow-up para WhatsApp, Instagram ou email.',
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
    description: 'Cria calendário de conteúdo para atrair leads no TikTok, Instagram e Facebook.',
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
    description: 'Gera consultas e links de pesquisa para encontrar leads em Google, Google Maps e Instagram.',
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
      return await answerQuestion(args);
    case 'prospecting_plan':
      return await makeProspectingPlan(args);
    case 'lead_analyzer':
      return await analyzeLead(args);
    case 'outreach_script':
      return await writeOutreach(args);
    case 'content_calendar':
      return await contentCalendar(args);
    case 'research_queries': {
      const result = await researchQueries(args);
      return JSON.stringify(result, null, 2);
    }
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
          capabilities: {
            tools: {}
          },
          serverInfo: {
            name: 'callivora',
            version: '1.0.0'
          },
          instructions: 'Use as ferramentas do CalLivora para prospecção, marketing e conteúdo comercial.'
        });

      case 'notifications/initialized':
      case 'ping':
        if (id === undefined || id === null) return null;
        return jsonRpcResult(id, {});

      case 'tools/list':
        return jsonRpcResult(id, { tools });

      case 'tools/call': {
        const toolName = params?.name;
        const args = params?.arguments || {};
        const text = await callTool(toolName, args);
        return jsonRpcResult(id, {
          content: [
            {
              type: 'text',
              text: String(text)
            }
          ]
        });
      }

      default:
        return jsonRpcError(id, -32601, `Método não encontrado: ${method}`);
    }
  } catch (error) {
    return jsonRpcError(id, -32000, error.message || 'Erro interno no MCP.');
  }
}
