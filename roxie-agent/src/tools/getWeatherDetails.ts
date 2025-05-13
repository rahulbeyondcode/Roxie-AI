import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const getWeatherDetails = tool(
  async ({ city }: { city: string }) => {
    console.log("Function call: ", city);
    if (city === "patiala") {
      return "-10°C";
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
    } else {
      return `Sorry no weather data found for ${city}`;
    }
  },
  {
    name: "getWeatherDetails",
    description:
      "Returns real-time weather for the specified city. Input should be a city name",
    schema: z.object({
      city: z
        .string()
        .describe(
          "A city name of which real time weather details must be fetched"
        ),
    }),
  }
);
