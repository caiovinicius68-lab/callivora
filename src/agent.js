import "dotenv/config";
import OpenAI from "openai";


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});



async function askOpenAI(messages) {

  const response =
    await client.chat.completions.create({

      model: "gpt-4o-mini",

      messages,

      temperature: 0.7

    });


  return response
    .choices[0]
    .message
    .content;

}






export async function answerQuestion({
  message,
  context = ""
}) {


return askOpenAI([

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

`
},


{
role:"user",
content:message
}

]);


}








export async function makeProspectingPlan(data={}) {


return askOpenAI([

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








export async function analyzeLead(data={}) {


return askOpenAI([

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








export async function writeOutreach(data={}) {


return askOpenAI([

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

Tom humano, natural e persuasivo.

Nunca pareça spam.
`

},


{
role:"user",
content:JSON.stringify(data,null,2)
}

]);


}








export async function contentCalendar(data={}) {


return askOpenAI([

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








export async function researchQueries(data={}) {


const result =
await askOpenAI([

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
- ideias de busca;
- oportunidades.

`

},


{
role:"user",
content:JSON.stringify(data,null,2)
}

]);


return {
result
};


}







export async function companyResearch(data = {}) {

  return askOpenAI([

    {
      role:"system",

      content:
`
Você é especialista em pesquisa estratégica de empresas.

Analise empresas considerando:

- mercado;
- posicionamento;
- oportunidades;
- necessidades;
- possíveis abordagens comerciais.

Entregue uma análise prática.
`
    },

    {
      role:"user",

      content:
        JSON.stringify(data,null,2)

    }

  ]);

}






export async function generateProposal(data = {}) {

  return askOpenAI([

    {
      role:"system",

      content:
`
Você cria propostas comerciais profissionais.

Estruture:

- apresentação;
- problema identificado;
- solução;
- benefícios;
- próximos passos.

Use linguagem persuasiva e profissional.
`
    },

    {
      role:"user",

      content:
        JSON.stringify(data,null,2)

    }

  ]);

}
export const agentInfo = {

name:"CalLivora AI",

version:"1.0.0",

poweredBy:"OpenAI"

};