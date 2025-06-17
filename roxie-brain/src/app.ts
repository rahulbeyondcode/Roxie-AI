import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
// import { ChatOllama } from "@langchain/ollama";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

import "./db";
import {
  AGENT_BACKEND_PORT,
  AI_MODEL_NAME,
  SYSTEM_PROMPT,
} from "./helpers/config";
import { generateRandomString } from "./helpers/utils";
import { tools } from "./tools";

dotenv.config();

const app = express();
const router = express.Router();

app.use(cors());
app.use(express.json());

const AIModel = new ChatGoogleGenerativeAI({
  model: AI_MODEL_NAME,
  temperature: 0.7,
});

// const AIModel = new ChatOllama({
//   model: AI_MODEL_NAME,
//   temperature: 0.7,
// });

const checkpointSaver = new MemorySaver();

const agent = createReactAgent({
  llm: AIModel,
  tools,
  checkpointSaver,
});

const sessionId = generateRandomString(7);

let isInitialLLMCall = false;

router.post("/ask", async (req: Request, res: Response) => {
  const query = req.body?.query as string;
  const thread_id = req.body?.thread_id || sessionId;
  let result;

  console.log(`🧑‍💻-> ${query}`);

  if (!query.trim()) {
    res.status(500).send({ message: "Please make sure to enter your query" });
    return;
  }
  try {
    if (isInitialLLMCall) {
      try {
        result = await agent.invoke(
          {
            messages: [
              new SystemMessage(SYSTEM_PROMPT),
              new HumanMessage(query),
            ],
          },
          { configurable: { thread_id } }
        );
        isInitialLLMCall = false;
      } catch (error) {
        res.status(500).send({
          message: "Roxie's brain froze up for some reason. Please try again",
          error,
        });
        return;
      }
    } else {
      try {
        result = await agent.invoke(
          {
            messages: [new HumanMessage(query)],
          },
          { configurable: { thread_id } }
        );
      } catch (error) {
        res.status(500).send({
          message: "Roxie's brain froze up for some reason. Please try again",
          error,
        });
        return;
      }
    }

    console.log(`🤖 -> ${result?.messages.at(-1)?.content}`);
    console.log("\n");

    res.json({ message: `${result?.messages.at(-1)?.content}` });
  } catch (error) {
    console.log("AI error: ", error);
    res.status(500).send({ error: "Error interacting with the model" });
  }
});

app.use("/api", router);

process.on("unhandledRejection", (reason, promise) => {
  console.error("🧨 Unhandled Rejection:", reason);
  // optional: log to a monitoring service
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  // optional: clean up or notify
});

app.listen(AGENT_BACKEND_PORT, () => {});
