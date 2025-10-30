import { OpenAI } from "openai"
import { config } from "dotenv"
config();

const API_KEY = process.env.OPENAI_API_KEY

if (!API_KEY) {
  console.log("OPEN AI API KEY MISSING");
}

const openai = new OpenAI({
  apiKey: API_KEY,
});

export default openai