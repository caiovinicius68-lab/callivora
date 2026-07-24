import { runGroq } from "./providers/groq-provider.js";


const resposta = await runGroq([

{
role:"system",
content:"Você é o Groq integrado ao Callivora."
},

{
role:"user",
content:"Explique em uma frase o que você faz."
}

]);


console.log(resposta);