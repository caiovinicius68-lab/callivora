import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);


const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite"
});



export async function runGemini(messages) {


  const prompt =
    messages
      .map(message => message.content)
      .join("\n\n");


  const result =
    await model.generateContent(prompt);


  return result.response.text();

}