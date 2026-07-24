import { runAI } from "./providers/router.js";


const resposta = await runAI([

{
role:"system",
content:"Você é o Callivora AI."
},

{
role:"user",
content:"Explique em uma frase como você ajuda uma empresa."
}

],
"auto"
);


console.log(resposta);