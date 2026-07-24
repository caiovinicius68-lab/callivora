import { runGemini } from "./gemini-provider.js";
import { runClaude } from "./claude-provider.js";
import { runGroq } from "./groq-provider.js";



export async function runAI(
  messages,
  provider = "auto"
){


if(provider === "gemini"){

return runGemini(messages);

}


if(provider === "groq"){

return runGroq(messages);

}


if(provider === "claude"){

return runClaude(messages);

}




// MODO AUTOMÁTICO

try {

return await runGemini(messages);

}

catch(error){

console.log(
"Gemini falhou, tentando Groq..."
);


}


try {

return await runGroq(messages);

}

catch(error){

console.log(
"Groq falhou, tentando Claude..."
);


}


return runClaude(messages);


}