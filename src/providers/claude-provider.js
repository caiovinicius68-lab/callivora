import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";


const client = new Anthropic({

  apiKey: process.env.CLAUDE_API_KEY

});



export async function runClaude(messages){


const system =
messages.find(
m => m.role === "system"
)?.content || "";



const user =
messages.find(
m => m.role === "user"
)?.content || "";



const response =
await client.messages.create({

model:
"claude-3-5-sonnet-latest",

max_tokens:1024,


system,


messages:[

{
role:"user",
content:user
}

]

});



return response.content[0].text;


}