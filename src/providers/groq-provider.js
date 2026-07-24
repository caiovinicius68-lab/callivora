import "dotenv/config";
import Groq from "groq-sdk";


const client = new Groq({

  apiKey: process.env.GROQ_API_KEY

});



export async function runGroq(messages){


const response =
await client.chat.completions.create({

model:
"llama-3.3-70b-versatile",

messages,

temperature:0.7

});


return response
.choices[0]
.message
.content;


}