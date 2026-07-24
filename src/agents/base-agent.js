import { runAI } from "../providers/router.js";


export async function executeAgent({
  system,
  message,
  context = ""
}) {


return runAI([

{
role:"system",
content:
`
${system}

Contexto do usuário:

${context}
`
},

{
role:"user",
content:message
}

],"auto");


}