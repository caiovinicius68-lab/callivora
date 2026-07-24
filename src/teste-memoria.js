import { salvarMemoria, buscarMemorias } from './services/memoria.js';

const idCliente = '3e852190-5469-440a-8992-0a8dca127fd2';

const memoria = await salvarMemoria({
  cliente_id: idCliente,
  titulo: 'Conhecimento inicial',
  conteudo: 'Cliente gosta de estudos profundos e interpretações avançadas.',
  categoria: 'Preferências'
});

console.log('Memória criada:', memoria);

const lista = await buscarMemorias(idCliente);

console.log('Memórias:', lista);