import express, { Request, Response } from "express";
import dotenv from "dotenv";

import { ChatOllama } from "@langchain/ollama";
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { StructuredOutputParser } from "langchain/output_parsers";

import { AI_MODEL_NAME, AGENT_BACKEND_PORT } from "./config";
import { tools } from "./tools";

dotenv.config();

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

console.log("ENV: ", process.env.TAVILY_API_KEY);

const parser = StructuredOutputParser.fromNamesAndDescriptions({
  type: "The kind of step: user, plan, action, observation, or output",
  function: "The name of the function to call (optional)",
  input: "The input to the function (optional)",
  user: "Original user question (optional)",
  plan: "Planning step (optional)",
  observation: "Observation from the tool (optional)",
  output: "Final output to user (optional)",
});

// const SYSTEM_PROMPT = `
// You are an AI agent that operates using a structured reasoning loop:
// plan → action → observation → output

// Behavior Rules:

// - You will receive a list of previously executed reasoning steps in JSON format.
// - Each step is a JSON object with a "type" field.
// - Your role is to analyze the latest step and respond with the next logical step as a single JSON object.
// - Follow the reasoning flow strictly:
//   plan → action → observation → (repeat if needed) → output

// Thought Process:

// - plan: Think about what needs to be done next.
// - action: If the plan involves a tool, invoke it.
// - observation: Analyze the result returned by the action.
// - output: When all data is available, generate the final response.

// Available Tools:
// - getWeatherDetails(city: string)
//   → Returns real-time weather for the specified city.

// > Only use tools if the task requires real-time data.
// > Do not skip reasoning steps.
// > Never respond with multiple steps — return just the next step.

// Response Format:
// Respond with one raw JSON object, no markdown, no quotes, no extra text.

// Example:
// You get
// { role: "human", content: '{"type": "user", "user": "What is the sum of weather in Patiala and Mohali?"}' }
// → You return:
// { "type": "plan", "plan": "Get weather for Patiala" }

// → You get:
// [
//   { role: "human", content: '{"type": "user", "user": "What is the sum of weather in Patiala and Mohali?"}' },
//   { role: "human", content: '{"type": "plan", "plan": "Get weather for Patiala"}' }
// ]
// → You return:
// { "type": "action", "function": "getWeatherDetails", "input": "patiala" }

// → You get:
// [
//   { role: "human", content: '{"type": "user", "user": "What is the sum of weather in Patiala and Mohali?"}' },
//   { role: "human", content: '{"type": "plan", "plan": "Get weather for Patiala"}' },
//   { role: "human", content: '{"type": "action", "function": "getWeatherDetails", "input": "patiala"}' },
//   { role: "human", content: '{"type": "observation", "observation": "14°C"}' }
// ]
// → You return:
// { "type": "plan", "plan": "Get weather for Mohali" }

// → You get:
// [
//   { role: "human", content: '{"type": "user", "user": "What is the sum of weather in Patiala and Mohali?"}' },
//   { role: "human", content: '{"type": "plan", "plan": "Get weather for Patiala"}' },
//   { role: "human", content: '{"type": "action", "function": "getWeatherDetails", "input": "patiala"}' },
//   { role: "human", content: '{"type": "observation", "observation": "14°C"}' },
//   { role: "human", content: '{"type": "plan", "plan": "Get weather for Mohali"}' },
// ]
// → You return:
//   { "type": "action", "function": "getWeatherDetails", "input": "mohali" }

// → You get:
// [
//   { role: "human", content: '{"type": "user", "user": "What is the sum of weather in Patiala and Mohali?"}' },
//   { role: "human", content: '{"type": "plan", "plan": "Get weather for Patiala"}' },
//   { role: "human", content: '{"type": "action", "function": "getWeatherDetails", "input": "patiala"}' },
//   { role: "human", content: '{"type": "observation", "observation": "14°C"}' },
//   { role: "human", content: '{"type": "plan", "plan": "Get weather for Mohali"}' },
//   { role: "human", content: '{"type": "action", "function": "getWeatherDetails", "input": "mohali"}' },
//   { role: "human", content: '{"type": "observation", "observation": "10°C"}' }
// ]

// → Finally since you have both weather details you respond with the sum in JSON:
// { "type": "output", "output": "The sum of weather of Patiala and Mohali is 24°C" }

// Even if you don't want to use tools respond in json format only.
// Example:

// You get
// { role: "human", content: '{"type": "user", "user": "Hello"}' }
// → You return:
// { "type": "output", "output": "Hello" }

// `;

const SYSTEM_PROMPT = `
You are an AI agent that operates in a reasoning loop:  
plan → action → observation → output

Rules:
- Input is a JSON array of prior steps.
- Output is always a single JSON step.
- Always follow the reasoning loop strictly.
- Use tools only when needed.
- No markdown, quotes, or extra text — just raw JSON.

Step Types:
- plan: Think about what to do.
- action: Call a tool.
- observation: Review tool result.
- output: Give final answer when ready.

Available Tools:
- getWeatherDetails(city: string)

Example flow:
1. { "type": "plan", "plan": "Get weather for Patiala" }
2. { "type": "action", "function": "getWeatherDetails", "input": "patiala" }
3. { "type": "observation", "observation": "14°C" }
4. { "type": "output", "output": "It’s 14°C in Patiala." }

If no tool is needed:
→ Input: { "type": "user", "user": "Hello" }  
→ Output: { "type": "output", "output": "Hello" }

`;

router.get("/ask", async (req: Request, res: Response) => {
  const query = req.query.query as string;

  console.log("query: ", query);

  // fetchEmebddings(query);

  if (!query) {
    res.status(500).send({ reply: "Please make sure to enter your query" });
  }
  try {
    const AIModel = new ChatOllama({
      model: AI_MODEL_NAME,
      temperature: 0.7,
    });

    const messages: BaseLanguageModelInput = [
      {
        role: "system",
        content: `{ type: "system", system: ${SYSTEM_PROMPT} }`,
      },
      { role: "human", content: `{ type: "user", user: ${query} }` },
    ];

    console.log(
      "messages: ",
      messages.filter((a, i) => i !== 0)
    );

    const recursiveAICall = async () => {
      const AIResponse = await AIModel.invoke(messages);

      console.log("AIResponse: ", AIResponse?.content);

      messages.push({
        role: "human",
        content: JSON.stringify(AIResponse?.content),
      });

      const {
        type,
        function: func,
        input,
        output,
      } = JSON.parse(AIResponse?.content as string) as ParsedResponseType;

      if (type === "output") {
        res.status(200).send({
          reply: output || AIResponse?.content || "AI Model didn't respond",
        });
      } else if (type === "action") {
        if (!tools[func]) {
          recursiveAICall();
        } else {
          const actionFunction = tools[func];
          const observation = actionFunction(input);

          const observationObject = {
            type: "observation",
            observation: observation,
          };

          messages.push({
            role: "human",
            content: JSON.stringify(observationObject),
          });
          recursiveAICall();
        }
      } else {
        recursiveAICall();
      }
    };

    recursiveAICall();
  } catch (err) {
    res.status(500).send({ error: "Error interacting with the model" });
  }
});

app.use("/api", router);

app.listen(AGENT_BACKEND_PORT, () => {});
