import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

import { AGENT_BACKEND_PORT, AI_MODEL_NAME, SYSTEM_PROMPT } from "./config";
import { generateRandomString } from "./helpers/utils";
import { tools } from "./tools";

dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json());

const AIModel = new ChatGoogleGenerativeAI({
  model: AI_MODEL_NAME,
  temperature: 0.7,
});

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

  if (!query) {
    res.status(500).send({ reply: "Please make sure to enter your query" });
  }
  try {
    if (isInitialLLMCall) {
      result = await agent.invoke(
        {
          messages: [new SystemMessage(SYSTEM_PROMPT), new HumanMessage(query)],
        },
        { configurable: { thread_id } }
      );
      isInitialLLMCall = false;
    } else {
      result = await agent.invoke(
        {
          messages: [new HumanMessage(query)],
        },
        { configurable: { thread_id } }
      );
    }

    console.log(`🤖 -> ${result?.messages.at(-1)?.content}`);
    console.log("\n");

    res.json({ response: `🤖 -> ${result?.messages.at(-1)?.content}` });
  } catch (err) {
    console.log("err: ", err);
    res.status(500).send({ error: "Error interacting with the model" });
  }
});

app.use("/api", router);

app.listen(AGENT_BACKEND_PORT, () => {});
