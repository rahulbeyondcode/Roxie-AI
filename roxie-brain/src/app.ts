import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

import { initDB, sqlDB } from "./db";
import { createTables } from "./db/schema";
import { seedCategories } from "./db/seed";
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

const AIModel = new ChatOpenAI({
  model: AI_MODEL_NAME,
  temperature: 0.7,
  apiKey: process.env.OPENROUTER_API_KEY,
  configuration: {
    baseURL: process.env.OPENROUTER_BASE_URL,
  },
});

const checkpointSaver = new MemorySaver();

const agent = createReactAgent({
  llm: AIModel,
  tools,
  checkpointSaver,
  prompt: new SystemMessage(SYSTEM_PROMPT),
});

router.post("/ask", async (req: Request, res: Response) => {
  const query = req.body?.query as string;
  const thread_id = req.body?.thread_id || generateRandomString(7);

  console.log(`🧑‍💻-> ${query}`);

  if (!query || !query.trim()) {
    res.status(400).send({ message: "Please provide a query" });
    return;
  }

  try {
    const result = await agent.invoke(
      {
        messages: [new HumanMessage(query)],
      },
      { configurable: { thread_id } }
    );

    const aiResponse = result?.messages.at(-1)?.content || "";

    console.log(`🤖 -> ${aiResponse}`);
    console.log("\n");

    res.json({
      message: `${aiResponse}`,
      thread_id,
    });
  } catch (error: any) {
    console.error("AI error: ", error);

    if (error.response?.status === 401) {
      res.status(401).send({
        message:
          "Invalid API key for OpenRouter. Please check your configuration.",
        error: error.message,
      });
    } else if (error.response?.status === 429) {
      res.status(429).send({
        message:
          "Rate limit exceeded for OpenRouter API. Please try again later.",
        error: error.message,
      });
    } else if (error.code === "ECONNRESET" || error.code === "ENOTFOUND") {
      res.status(503).send({
        message:
          "Network error connecting to OpenRouter API. Please check your connection.",
        error: error.message,
      });
    } else {
      res.status(500).send({
        message: "Error interacting with the AI model",
        error: error.message || "Unknown error occurred",
      });
    }
  }
});

app.use("/api", router);

process.on("unhandledRejection", (reason, promise) => {
  console.error("🧨 Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
});

const startServer = async () => {
  try {
    await initDB();
    await createTables(sqlDB);
    await seedCategories(sqlDB);
  } catch (error) {
    console.error("Startup error:", error);
  }

  app.listen(AGENT_BACKEND_PORT, () => {
    console.log(`Roxie AI backend listening on port ${AGENT_BACKEND_PORT}`);
  });
};

startServer();
