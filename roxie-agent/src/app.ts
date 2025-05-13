import { HumanMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import dotenv from "dotenv";
import express, { Request, Response } from "express";

import { AGENT_BACKEND_PORT, AI_MODEL_NAME } from "./config";
import { tools } from "./tools";

dotenv.config();

const app = express();
const router = express.Router();

app.use(express.json());

router.get("/ask", async (req: Request, res: Response) => {
  const query = req.query.query as string;

  console.log(`🧑‍💻-> ${query}`);

  if (!query) {
    res.status(500).send({ reply: "Please make sure to enter your query" });
  }
  try {
    const AIModel = new ChatGoogleGenerativeAI({
      model: AI_MODEL_NAME,
      temperature: 0.7,
    });

    const agent = createReactAgent({
      llm: AIModel,
      tools,
    });

    const result = await agent.invoke({
      messages: [new HumanMessage(query)],
    });

    console.log(`🤖 -> ${result?.messages.at(-1)?.content}`);

    res.json({ response: `🤖 -> ${result?.messages.at(-1)?.content}` });
  } catch (err) {
    res.status(500).send({ error: "Error interacting with the model" });
  }
});

app.use("/api", router);

app.listen(AGENT_BACKEND_PORT, () => {});
