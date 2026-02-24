import { HumanMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { createAgent, createMiddleware } from "langchain";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

import { initDB, sqlDB } from "./db";
import { createTables } from "./db/schema";
import { seedCategories } from "./db/seed";
import {
  AGENT_BACKEND_PORT,
  AI_MODEL_NAME,
  ONBOARDING_PROMPT,
  SYSTEM_PROMPT,
  WAKEUP_PROMPT,
} from "./helpers/config";
import { loadCategoryNames } from "./helpers/category-helper";
import { checkUserHasName, loadUserProfile } from "./helpers/profile-loader";
import { generateRandomString, handleApiError } from "./helpers/utils";
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

const onboardingGate = createMiddleware({
  name: "onboardingGate",
  wrapModelCall: async (request, handler) => {
    const hasName = await checkUserHasName();

    if (!hasName) {
      return handler({
        ...request,
        systemPrompt: ONBOARDING_PROMPT,
        tools: request.tools.filter((t) => t.name === "set_profile"),
      });
    }

    const [profileMarkdown, categoryNames] = await Promise.all([
      loadUserProfile(),
      loadCategoryNames(),
    ]);

    let prompt = SYSTEM_PROMPT;

    if (profileMarkdown) {
      prompt += `\n\n## Known User Profile\n\n${profileMarkdown}`;
    }

    if (categoryNames.length > 0) {
      prompt += `\n\n## Existing Categories\n\n${categoryNames.join(", ")}\n\nAlways prefer these over creating new ones. Only create a new category if nothing here fits.`;
    }

    return handler({ ...request, systemPrompt: prompt });
  },
});

const agent = createAgent({
  model: AIModel,
  tools,
  checkpointer: checkpointSaver,
  middleware: [onboardingGate],
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

    let aiResponse = result?.messages.at(-1)?.content || "";

    if (!String(aiResponse).trim()) {
      const hasName = await checkUserHasName();
      const nudge = hasName
        ? "I have nothing else right now. Ask me something about myself."
        : "I didn't answer yet. Ask me for my name — you need it before you can help me.";

      console.log(
        `🤖 -> Empty response, nudging towards ${hasName ? "personal question" : "name collection"}`
      );

      const followUp = await agent.invoke(
        { messages: [new HumanMessage(nudge)] },
        { configurable: { thread_id } }
      );

      aiResponse = followUp?.messages.at(-1)?.content || "";
    }

    console.log(`🤖 -> ${aiResponse}`);
    console.log("\n");

    res.json({
      message: `${aiResponse}`,
      thread_id,
    });
  } catch (error: any) {
    handleApiError(error, res, "interacting with the AI model");
  }
});

router.post("/greet", async (req: Request, res: Response) => {
  const thread_id = req.body?.thread_id || generateRandomString(7);

  console.log(`👋 Greeting request for thread ${thread_id}`);

  try {
    const hasName = await checkUserHasName();
    const prompt = hasName
      ? WAKEUP_PROMPT
      : "Hello, I just opened the app.";

    const result = await agent.invoke(
      {
        messages: [new HumanMessage(prompt)],
      },
      { configurable: { thread_id } }
    );

    let aiResponse = result?.messages.at(-1)?.content || "";

    if (!String(aiResponse).trim()) {
      const nudge = hasName
        ? "I have nothing else right now. Ask me something about myself."
        : "I didn't answer yet. Ask me for my name — you need it before you can help me.";

      console.log(
        `👋 Empty greeting response, nudging towards ${hasName ? "personal question" : "name collection"}`
      );

      const followUp = await agent.invoke(
        { messages: [new HumanMessage(nudge)] },
        { configurable: { thread_id } }
      );

      aiResponse = followUp?.messages.at(-1)?.content || "";
    }

    console.log(`👋 -> ${aiResponse}`);
    console.log("\n");

    res.json({
      message: `${aiResponse}`,
      thread_id,
    });
  } catch (error: any) {
    handleApiError(error, res, "generating greeting");
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
    console.log(
      `Roxie AI (powered by ${AI_MODEL_NAME} 🚀) listening on port ${AGENT_BACKEND_PORT}`
    );
  });
};

startServer();
