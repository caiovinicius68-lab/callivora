import { buscarCliente } from './services/clientes.js';
import { buscarMemorias, salvarMemoria } from './services/memoria.js';
import { buscarConversas } from './services/conversas.js';

import { analisarMemoria } from "./services/memory-learning.js";



export async function buscarContextoCliente(cliente_id) {

  const cliente = await buscarCliente(cliente_id);

  const memorias = await buscarMemorias(cliente_id);

  const conversas = await buscarConversas(cliente_id);


  return {
    cliente,
    memorias,
    conversas
  };

}





export async function aprenderMemoriaAutomatica(
  cliente_id,
  pergunta,
  resposta
){


  const memoria =
    await analisarMemoria(
      pergunta,
      resposta
    );



  if(
    !memoria.categoria ||
    !memoria.conteudo
  ){

    return null;

  }



  return salvarMemoria({

    cliente_id,

    titulo:
      memoria.categoria,

    conteudo:
      memoria.conteudo,

    categoria:
      memoria.categoria

  });


}