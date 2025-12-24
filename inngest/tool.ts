import { tool } from "ai";
import z from "zod";

export const unsplashTool = tool({
  description: "Search for high-quality images from Unsplash based on a query.",
  inputSchema: z.object({
    query: z.string().describe("The search keywords to find an image."),
    orientation: z
      .enum(["landscape", "portrait", "squarish"])
      .default("landscape"),
  }),

  execute: async ({ query, orientation }) => {
    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&orientation=${orientation}&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Unsplash API request failed");
      }

      const data = await res.json();

      return data?.results?.[0]?.urls?.regular || "";
    } catch (error) {
      console.error("Unsplash tool error:", error);
      return "";
    }
  },
});
