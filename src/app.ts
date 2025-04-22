import express, { Request, Response } from "express";

import { ChatOllama } from "@langchain/ollama";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { StructuredOutputParser } from "langchain/output_parsers";

import { AI_MODEL_NAME, PORT } from "./config";
import { tools } from "./tools";

type ParsedResponseType = {
  type: string;
  observation: string;
  function: "getWeatherDetails";
  input: string;
  user: string;
  plan: string;
  output: string;
};

const app = express();
const router = express.Router();

app.use(express.json());

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  type: "The kind of step: user, plan, action, observation, or output",
  function: "The name of the function to call (optional)",
  input: "The input to the function (optional)",
  user: "Original user question (optional)",
  plan: "Planning step (optional)",
  observation: "Observation from the tool (optional)",
  output: "Final output to user (optional)",
});

const SYSTEM_PROMPT = `
You are an AI Agent that follows a structured reasoning loop with the format:
user → plan → action → observation → output

You have the following tool available:
- getWeatherDetails(city: string): Returns the weather of the given city.

Instructions:
1. Use the tool only when necessary — if the answer requires real-time data.
2. Always follow the order: user → plan → action → observation → output.
3. Each step must be represented as a **JSON object** with a "type" field.
4. Return **one single JSON array** containing all reasoning steps.
5. Do not wrap the JSON in quotes.
6. Do not include markdown, extra text, or explanations. Just return raw JSON.
7. Do not return separate JSON blocks. Combine all steps in a single array.

Example:
[
  { "type": "user", "user": "What is the sum of weather in Patiala and Mohali?" },
  { "type": "plan", "plan": "Get weather for Patiala" },
  { "type": "action", "function": "getWeatherDetails", "input": "patiala" },
  { "type": "observation", "observation": "10°C" },
  { "type": "plan", "plan": "Now get weather for Mohali" },
  { "type": "action", "function": "getWeatherDetails", "input": "mohali" },
  { "type": "observation", "observation": "14°C" },
  { "type": "output", "output": "The sum is 24°C" }
]

Respond using this exact format.
`;

router.get("/ask", async (req: Request, res: Response) => {
  const query = req.query.query as string;

  console.log("query: ", query);

  if (!query) {
    res.status(500).send({ reply: "Please make sure to enter your query" });
  }
  try {
    const AIModel = new ChatOllama({
      model: AI_MODEL_NAME,
      temperature: 0.7,
    });

    const messages: BaseLanguageModelInput = [
      ["system", SYSTEM_PROMPT],
      ["user", query],
    ];

    const recursiveAICall = async () => {
      const AIResponse = await AIModel.invoke(messages);

      console.log("AIResponse?.content: ", JSON.stringify(AIResponse?.content));

      const stringifiedAIResponnse = (AIResponse?.content as string)
        ?.replace("json", "")
        .replaceAll("```", "");

      // const parsedOutput = await parser.parse(AIResponse.content as string);

      messages.push({
        role: "assistant",
        content: stringifiedAIResponnse,
      });

      const {
        type,
        function: func,
        input,
        output,
      } = JSON.parse(stringifiedAIResponnse as string) as ParsedResponseType;

      if (type === "output") {
        console.log("Hit: ", 1);
        res.status(200).send({
          reply: output || AIResponse?.content || "AI Model didn't respond",
        });
      } else if (type === "action") {
        console.log("Hit: ", 2);
        const actionFunction = tools[func];
        const observation = actionFunction(input);

        const observationObject = {
          type: "observation",
          observation: observation,
        };

        messages.push({
          role: "developer",
          content: JSON.stringify(observationObject),
        });
        recursiveAICall();
      } else {
        console.log("Hit: ", 3);
        recursiveAICall();
      }
    };

    recursiveAICall();

    // res.status(200).send({
    //   reply: AIResponse?.content || "AI Model didn't respond",
    // });
  } catch (err) {
    res.status(500).send({ error: "Error interacting with the model" });
  }
});

app.use("/api", router);

app.listen(PORT, () => {});
