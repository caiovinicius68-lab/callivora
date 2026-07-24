import "dotenv/config";
import OpenAI from "openai";


const client = new OpenAI({

  apiKey: process.env.OPENAI_API_KEY

});



export async function runOpenAI(messages) {


  const response =
    await client.chat.completions.create({

      model:
        process.env.OPENAI_MODEL || "gpt-5.4-mini",

      messages,

      temperature: 0.7

    });


  return response
    .choices[0]
    .message
    .content;

}