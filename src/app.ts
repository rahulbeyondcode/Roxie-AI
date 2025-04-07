import express, { Request, Response } from "express";

import { ChatOllama } from "@langchain/ollama";

import { AI_MODEL_NAME, PORT } from "./config";

const app = express();
const router = express.Router();

app.use(express.json());

const SYSTEM_PROMPT = `
You are an AI Assistant with START, PLAN, ACTION, Obeservation and Output State. 
Wait for the user prompt and first PLAN using available tools. 
After Planning, Take the action with appropriate tools and wait for Observation based on Action. Once you get the observations, Return the AI response based on START propmt and observations 

Available Tools: — function getWeatherDetails(city: string): string 
getWeatherDetails is a function that accepts city name as string and retuns the weather details 

Example: 
START 
 { "type": "user", "user": "What is the sum of weather of Patiala and Mohali?" }
 { "type": "plan", "plan": "I will call the getWeatherDetails for Patiala" }
 { "type": "action", "function": "getWeatherDetails", "input": "patiala" }
 { "type": "observation", "observation": "10°C" }
 { "type": "plan", "plan": "I will call getWeatherDetails for Mohali" }
 { "type": "action", "function": "getWeatherDetails", "input": "mohali" }
 { "type": "observation", "observation": "14°C" }
 { "type": "output", "output": The sum of weather of Patiala and Mohali is 24°C" }`;

router.post("/ask", async (req: Request, res: Response) => {
  const { query } = req.body;

  if (!query) {
    res.status(500).send({ reply: "Please make sure to enter your query" });
  }
  try {
    const model = new ChatOllama({
      model: AI_MODEL_NAME,
      temperature: 0.7,
    });

    const response = await model.invoke([
      "system",
      SYSTEM_PROMPT,
      "user",
      query,
    ]);

    console.log("response: ", response?.content);

    res
      .status(200)
      .send({ reply: response?.content || "AI Model didn't respond" });
  } catch (err) {
    res.status(500).send({ error: "Error interacting with the model" });
  }
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
