import express from "express";
import ollama from "ollama";
import { ChatOllama } from "@langchain/ollama";

import { AI_MODEL_NAME, PORT } from "./config";

const model = new ChatOllama({
  model: AI_MODEL_NAME,
});

const app = express();
const router = express.Router();

app.use(express.json());

router.post("/ask", async (req: any, res: any) => {
  const { query } = req.body;

  try {
    const response = await ollama.chat({
      model: "qwen2.5-coder:3b-instruct-q4_K_M",
      messages: [{ role: "user", content: query }],
    });

    res.json({ reply: response.message.content });
  } catch (err) {
    res.status(500).send({ error: "Error interacting with the model" });
  }
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
