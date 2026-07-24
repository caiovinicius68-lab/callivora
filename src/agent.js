import "dotenv/config";

import { runAI } from "./providers/router.js";

import { buscarContextoCliente } from "./memory-manager.js";



async function askAI(messages){

  return runAI(messages,"auto");

}




export async function answerQuestion({

  message,

  cliente_id = null,

  context = ""

}) {



let memoria = "";



if(cliente_id){


const dadosCliente =
await buscarContextoCliente(cliente_id);



memoria =
JSON.stringify(
dadosCliente,
null,
2
);


}





return askAI([


{

role:"system",

content:

`
Você é o CalLivora AI.

Uma inteligência artificial para empresas,
marketing, vendas, atendimento e estratégia.

Ajude com:

- criação de conteúdo;
- redes sociais;
- clientes;
- vendas;
- monetização;
- organização;
- estratégias comerciais.

Responda sempre em português do Brasil.

Seja claro, profissional e prático.


Contexto:

${context}


Memória do cliente:

${memoria}

`

},



{

role:"user",

content:message

}



]);


}








export async function makeProspectingPlan(data={}){


return askAI([

{

role:"system",

content:

`
Você é especialista em prospecção comercial.

Crie planos contendo:

- público alvo;
- canais;
- abordagem;
- mensagem inicial;
- argumentos;
- follow-up;
- próximos passos.

Seja estratégico e aplicável.

`

},


{

role:"user",

content:JSON.stringify(data,null,2)

}


]);


}








export async function analyzeLead(data={}){


return askAI([

{

role:"system",

content:

`
Você é especialista em vendas B2B.

Analise o lead informado.

Avalie:

- potencial;
- perfil;
- oportunidade;
- necessidades;
- abordagem ideal.

Entregue uma análise comercial.

`

},


{

role:"user",

content:JSON.stringify(data,null,2)

}


]);


}








export async function writeOutreach(data={}){


return askAI([

{

role:"system",

content:

`
Você cria mensagens profissionais de prospecção.

Gere:

- primeira abordagem;
- mensagem de conexão;
- follow-up;
- quebra de objeções.

Tom humano e natural.

`

},


{

role:"user",

content:JSON.stringify(data,null,2)

}


]);


}








export async function contentCalendar(data={}){


return askAI([

{

role:"system",

content:

`
Você é especialista em marketing de conteúdo.

Crie calendários estratégicos para redes sociais.

Inclua:

- ideias;
- formatos;
- temas;
- ganchos;
- CTA.

`

},


{

role:"user",

content:JSON.stringify(data,null,2)

}


]);


}








export async function researchQueries(data={}){


return {

result:

await askAI([

{

role:"system",

content:

`
Você é especialista em pesquisa comercial.

Crie estratégias para encontrar clientes.

Gere:

- palavras-chave;
- pesquisas;
- filtros;
- oportunidades.

`

},

{

role:"user",

content:JSON.stringify(data,null,2)

}


])


};


}








export async function companyResearch(data={}){


return askAI([

{

role:"system",

content:

`
Você é especialista em pesquisa estratégica de empresas.

Analise:

- mercado;
- posicionamento;
- oportunidades;
- necessidades.

`

},

{

role:"user",

content:JSON.stringify(data,null,2)

}

]);


}








export async function generateProposal(data={}){


return askAI([

{

role:"system",

content:

`
Você cria propostas comerciais profissionais.

Estruture:

- apresentação;
- problema;
- solução;
- benefícios;
- próximos passos.

`

},

{

role:"user",

content:JSON.stringify(data,null,2)

}

]);


}







export const agentInfo = {


name:"CalLivora AI",

version:"1.0.0",

poweredBy:"Google Gemini"


};