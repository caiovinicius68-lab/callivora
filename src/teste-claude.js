import { runClaude } from "./providers/claude-provider.js";


const resposta = await runClaude([

{
role:"system",
content:"Você é o Claude integrado ao Callivora."
},

{
role:"user",
content:"Explique em uma frase o que você faz."
}

]);


console.log(resposta);