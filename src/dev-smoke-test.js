import assert from 'node:assert/strict';
import { handleMcpRequest } from './mcp-core.js';
import { researchQueries } from './agent.js';

const init = await handleMcpRequest({ jsonrpc: '2.0', id: 1, method: 'initialize', params: {} });
assert.equal(init.result.serverInfo.name, 'callivora');

const list = await handleMcpRequest({ jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} });
assert.ok(list.result.tools.length >= 5);

const call = await handleMcpRequest({
  jsonrpc: '2.0',
  id: 3,
  method: 'tools/call',
  params: {
    name: 'research_queries',
    arguments: { segment: 'restaurante', city: 'São Paulo' }
  }
});
assert.ok(call.result.content[0].text.includes('restaurante'));

const research = await researchQueries({ segment: 'clínica odontológica', city: 'Brasília' });
assert.ok(research.queries.length > 0);
assert.ok(research.queries[0].google.startsWith('https://www.google.com/search'));

console.log('CalLivora smoke test OK');
