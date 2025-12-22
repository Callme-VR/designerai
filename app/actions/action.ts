"use server"

import { openrouter } from "@/lib/openrouter"
import { generateText } from "ai"

export async function generateProjectName(prompt: string) {
     try {
          const { text } = await generateText({
               model: openrouter.chat("google/gemini-2.5-flash"),
               system: `
Generate a VERY SHORT project name.
Rules:
- Max 3-5 words
- No special characters  
- Capitalize properly    
      `,
               prompt,
               temperature: 0.4,
               maxOutputTokens: 20, // ✅ FIX
          })

          return text?.trim() || "Untitled Project"
     } catch (error) {
          console.error("AI project name failed:", error)
          return "Untitled Project"
     }
}
