export function analyzeTrend(message = "") {

const text = String(message).toLowerCase();


const trend = {

niche:"",

viralFormats:[],

hooks:[],

scripts:[],

strategy:[]

};



// ESPIRITUALIDADE / TAROT

if(
text.includes("tarot") ||
text.includes("carta") ||
text.includes("cristal") ||
text.includes("espiritual")
){

trend.niche =
"espiritualidade e autoconhecimento";


trend.viralFormats.push(

"Escolha uma carta",

"Mensagem que apareceu para você",

"3 sinais que o universo está mostrando",

"Antes de dormir faça essa reflexão",

"História e significado de símbolos"

);



trend.hooks.push(

"Se você parou nesse vídeo, existe um motivo",

"Essa carta apareceu para você por uma razão",

"Poucas pessoas percebem esse sinal",

"Preste atenção nessa mensagem"

);



trend.scripts.push(`

GANCHO:

Se você chegou até aqui, essa mensagem pode ser importante para você.


CENA 1:

Mostrar cartas sendo embaralhadas.


CENA 2:

Revelar uma carta.


CENA 3:

Explicar o significado emocional.


FINAL:

Comente uma palavra se essa mensagem fez sentido.

`);



trend.strategy.push(

"Criar séries diárias",

"Estimular comentários",

"Criar comunidade",

"Transformar seguidores em consultas"

);


}





// CRIADORES GERAIS

if(
text.includes("instagram") ||
text.includes("tiktok") ||
text.includes("crescer")
){

trend.viralFormats.push(

"Antes e depois",

"Erro comum",

"História pessoal",

"Lista rápida",

"Opinião forte"

);


trend.hooks.push(

"Pare de fazer isso",

"Ninguém fala sobre isso",

"Eu descobri depois de anos"

);


}



if(trend.viralFormats.length === 0){

trend.viralFormats.push(

"Análise de tendências",

"Conteúdo educativo",

"Storytelling"

);

}



return trend;

}





export function buildTrendContext(message){


const trend =
analyzeTrend(message);



return `


RADAR DE TENDÊNCIAS:


Nicho identificado:

${trend.niche}



Formatos com potencial:

${trend.viralFormats.join("\n")}



Ganchos:

${trend.hooks.join("\n")}



Estratégias:

${trend.strategy.join("\n")}



Roteiro sugerido:

${trend.scripts.join("\n")}



Use isso para criar uma estratégia de crescimento.


`;

}