import { strategistAgent } from "./strategist-agent.js";
import { marketingAgent } from "./marketing-agent.js";
import { mentorAgent } from "./mentor-agent.js";



export async function routeAgent({
message,
context=""
}) {


const text =
message.toLowerCase();



if(
text.includes("vender") ||
text.includes("marketing") ||
text.includes("instagram") ||
text.includes("anúncio") ||
text.includes("cliente") ||
text.includes("tráfego")
){

return marketingAgent({
message,
context
});

}



if(
text.includes("empresa") ||
text.includes("negócio") ||
text.includes("estratégia") ||
text.includes("crescer") ||
text.includes("empreender")
){

return strategistAgent({
message,
context
});

}



return mentorAgent({

message,

context

});


}