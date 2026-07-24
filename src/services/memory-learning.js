import { runAI } from "../providers/router.js";


export async function analisarMemoria(pergunta,resposta){


const resultado = await runAI([

{
role:"system",
content:
`
Você é um sistema de memória de IA.

Analise a conversa e extraia somente informações permanentes do usuário.

Procure:

- conhecimentos;
- preferências;
- objetivos;
- interesses;
- nível de experiência.

Retorne somente JSON:

{
"categoria":"",
"conteudo":""
}

Se não existir informação importante:

{
"categoria":"",
"conteudo":""
}
`
},

{
role:"user",
content:
`
Pergunta:
${pergunta}

Resposta:
${resposta}
`
}

],"auto");


try{

return JSON.parse(
resultado
.replace(/```json/g,"")
.replace(/```/g,"")
.trim()
);


}catch{

return {
categoria:"",
conteudo:""
};

}


}