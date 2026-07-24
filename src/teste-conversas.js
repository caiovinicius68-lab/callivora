import { salvarConversa, buscarConversas } from './services/conversas.js';


const idCliente = '3e852190-5469-440a-8992-0a8dca127fd2';


const conversa = await salvarConversa({
  cliente_id: idCliente,
  pergunta: 'Quero aprofundar meus estudos.',
  resposta: 'Vamos avançar para conceitos mais profundos.'
});


console.log('Conversa salva:', conversa);


const historico = await buscarConversas(idCliente);


console.log('Histórico:', historico);