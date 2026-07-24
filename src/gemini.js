import "dotenv/config";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);


const model = genAI.getGenerativeModel({
  model: "gemini-3.1-flash-lite"
});

export async function askGemini(messages) {


  const system =
    messages.find(
      x => x.role === "system"
    )?.content || "";


  const user =
    messages.find(
      x => x.role === "user"
    )?.content || "";



  const result =
    await model.generateContent([
      {
        text:
        system +
        "\n\n" +
        user
      }
    ]);


  return result.response.text();

}