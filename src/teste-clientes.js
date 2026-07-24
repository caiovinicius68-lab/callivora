import { listarClientes, criarCliente } from './services/clientes.js';


const novo = await criarCliente({
  nome: 'Maria Teste',
  whatsapp: '11999999999',
  observacoes: 'Cliente criada pelo serviço do Callivora'
});

console.log('Criado:', novo);


const clientes = await listarClientes();

console.log('Lista:', clientes);