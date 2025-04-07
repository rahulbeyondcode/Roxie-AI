import { ChatPromptTemplate } from "@langchain/core/prompts";
import {
  StringOutputParser,
  CommaSeparatedListOutputParser,
} from "@langchain/core/output_parsers";

import { ChatOllama } from "@langchain/ollama";

import { AI_MODEL_NAME } from "./config";

const model = new ChatOllama({
  model: AI_MODEL_NAME,
  temperature: 0.7,
});

async function getStringOutputParserResponse(input: string) {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", "You are a doctor. Help the user with their medical questions."],
    ["human", "{input}"],
  ]);

  // Set the output parser
  const outputParser = new StringOutputParser();

  // Create a chain
  const chain = await prompt.pipe(model).pipe(outputParser);

  return chain.invoke({ input });
}

async function getCommaSeparatedListOutputParserResponse(input: string) {
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a english teacher. Help the user with 5 synonyms sepearated by commas.",
    ],
    ["human", "{input}"],
  ]);

  // Set the output parser
  const outputParser = new CommaSeparatedListOutputParser();

  // Create a chain
  const chain = await prompt.pipe(model).pipe(outputParser);

  return chain.invoke({ input });
}

// console.log("response: ", await getStringOutputParserResponse());
console.log(
  "response: ",
  await getCommaSeparatedListOutputParserResponse("happy")
);
