import express, { Request, Response } from "express";

import { ChatOllama } from "@langchain/ollama";

import { AI_MODEL_NAME, PORT } from "./config";

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

const getWeatherDetails = (city: string) => {
  if (city === "patiala") {
    return "10°C";
  } else if (city === "mohali") {
    return "14°C";
  } else if (city === "mumbai") {
    return "12°C";
  } else if (city === "okra") {
    return "15°C";
  } else if (city === "kollam") {
    return "16°C";
  } else if (city === "delhi") {
    return "18°C";
  }
};

const tools = {
  getWeatherDetails,
};

const SYSTEM_PROMPT = `
You are an AI Assistant with START, PLAN, ACTION, Observation and Output State. 
Wait for the user prompt and first PLAN using available tools. 
After Planning, take the action with appropriate tools and wait for Observation based on Action. Once you get the observations, return the AI response based on START propmt and observations 

Strictly follow the JSON output format as in examples for your response.

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

router.get("/ask", async (req: Request, res: Response) => {
  const query = JSON.stringify(req.query);

  if (!query) {
    res.status(500).send({ reply: "Please make sure to enter your query" });
  }
  try {
    const AIModel = new ChatOllama({
      model: AI_MODEL_NAME,
      temperature: 0.7,
    });

    console.log("query\n", query);
    console.log("---------------------------------------");
    console.log("");

    const response = await AIModel.invoke([
      ["system", SYSTEM_PROMPT],
      ["user", query],
    ]);

    console.log("response: ", response?.content);

    // const messages = [{ role: "system", content: SYSTEM_PROMPT }];

    // const userMessage = {
    //   role: "user",
    //   user: query,
    // };
    // messages.push({
    //   role: "user",
    //   content: JSON.stringify(userMessage),
    // });

    // while (true) {
    //   const response = await AIModel.invoke(messages);

    //   console.log(
    //     "\n\n-------------------------------------response: \n",
    //     response
    //   );

    //   const result = response?.content;

    //   console.log(
    //     "\n\n*************************************result:  \n",
    //     result
    //   );

    //   messages.push({
    //     role: "assistant",
    //     content: JSON.stringify(result),
    //   });

    //   const parsedResponse = JSON.parse(JSON.stringify(result));

    //   console.log(
    //     "\n\n+++++++++++++++++++++++++++++++++++++parsedResponse:  \n",
    //     parsedResponse
    //   );

    //   const {
    //     type,
    //     function: func,
    //     input,
    //     output,
    //   } = parsedResponse as ParsedResponseType;

    //   if (type === "output") {
    //     res.status(200).send({
    //       reply: output || response?.content || "AI Model didn't respond",
    //     });
    //     break;
    //   } else if (type === "action") {
    //     const actionFunction = tools[func];
    //     const observation = actionFunction(input);

    //     const observationObject = {
    //       type: "observation",
    //       observation: observation,
    //     };

    //     messages.push({
    //       role: "developer",
    //       content: JSON.stringify(observationObject),
    //     });
    //   }
    // }
    res.status(200).send({
      reply: response?.content || "AI Model didn't respond",
    });
  } catch (err) {
    res.status(500).send({ error: "Error interacting with the model" });
  }
});

app.use("/api", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
