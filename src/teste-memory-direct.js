import { buscarContextoCliente } from './memory-manager.js';


const contexto = await buscarContextoCliente(
  '3e852190-5469-440a-8992-0a8dca127fd2'
);


console.log(
  JSON.stringify(contexto, null, 2)
);