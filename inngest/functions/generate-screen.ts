import { generateObject, generateText } from "ai";
import { inngest } from "../client";
import { openrouter } from "@/lib/openrouter";
import z from "zod";
import { ANALYSIS_PROMPT, GENERATION_SYSTEM_PROMPT } from "@/lib/prompt";
import { FrameType } from "@/types/project";
import { BASE_VARIABLES, THEME_LIST } from "@/lib/themes";
import { unsplashTool } from "../tool";
import prisma from "@/lib/prisma";

/* ------------------------------------------------------------------ */
/* ANALYSIS SCHEMA – PLANNING ONLY */
/* ------------------------------------------------------------------ */

const AnalysisSchema = z.object({
  theme: z.string(),
  screens: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        purpose: z.string(),
        visualDescription: z.string(),
      })
    )
    .min(1)
    .max(4),
});

/* ------------------------------------------------------------------ */
/* INNGEST FUNCTION */
/* ------------------------------------------------------------------ */

export const GenerateScreen = inngest.createFunction(
  { id: "generate-screen" },
  { event: "ui/generate-screen" },
  async ({ event, step }) => {
    const {
      userId,
      projectId,
      prompt,
      frames,
      theme: existingTheme,
    } = event.data;

    const isRegeneration = frames.length > 0;

    /* -------------------------------------------------------------- */
    /* STEP 1 — ANALYZE & PLAN SCREENS */
    /* -------------------------------------------------------------- */

    const analysis = await step.run("analyze-and-plan", async () => {
      const previousFramesContext = frames
        .slice(0, 4)
        .map((f: FrameType) => f.htmlContent)
        .join("\n\n");

      const analysisPrompt = isRegeneration
        ? `
USER REQUEST:
${prompt}

SELECTED THEME:
${existingTheme}

EXISTING SCREENS HTML:
${previousFramesContext}
        `.trim()
        : `
USER REQUEST:
${prompt}
        `.trim();

      const { object } = await generateObject({
        model: openrouter("google/gemini-2.5-flash"),
        schema: AnalysisSchema,
        system: ANALYSIS_PROMPT,
        prompt: analysisPrompt,
      });

      return object;
    });

    /* -------------------------------------------------------------- */
    /* STEP 2 — RESOLVE THEME */
    /* -------------------------------------------------------------- */

    const themeToUse = isRegeneration ? existingTheme : analysis.theme;

    const selectedTheme = THEME_LIST.find((theme) => theme.id === themeToUse);

    const fullThemeCSS = `
${BASE_VARIABLES}
${selectedTheme?.style || ""}
    `.trim();

    /* -------------------------------------------------------------- */
    /* STEP 3 — GENERATE EACH SCREEN */
    /* -------------------------------------------------------------- */

    for (let i = 0; i < analysis.screens.length; i++) {
      const screenPlan = analysis.screens[i];

      const previousFramesContext = frames
        .map((f: FrameType) => f.htmlContent)
        .join("\n\n");

      await step.run(`generate-screen-${screenPlan.id}`, async () => {
        const { text } = await generateText({
          model: openrouter("google/gemini-2.5-flash"),
          system: GENERATION_SYSTEM_PROMPT,
          tools: {
            searchUnsplash: unsplashTool,
          },

          prompt: `
- Screen ${i + 1}/${analysis.screens.length}
- Screen ID: ${screenPlan.id}
- Screen Name: ${screenPlan.name}
- Screen Purpose: ${screenPlan.purpose}

VISUAL DESCRIPTION:
${screenPlan.visualDescription}

EXISTING SCREENS REFERENCE (Extract and reuse components):
${previousFramesContext || "No previous screens"}

THEME VARIABLES (REFERENCE ONLY – DO NOT REDECLARE):
${fullThemeCSS}

CRITICAL REQUIREMENTS — MUST FOLLOW:

- If previous screens exist, COPY the EXACT bottom navigation
- Reuse cards, headers, buttons — DO NOT redesign
- Maintain spacing, hierarchy, colors
- This screen MUST feel from the same app

STRICT OUTPUT RULES:

1. Output ONLY raw HTML
2. Single root <div>
3. Root:
   - Regular → w-full h-full min-h-screen
   - Overlay → relative w-full h-screen
4. Scrollable areas must hide scrollbars:
   [&::-webkit-scrollbar]:hidden scrollbar-none
5. Use Tailwind for layout & spacing
6. Use theme CSS vars ONLY for colors
7. No markdown, no comments, no <html>/<body>/<head>
8. iframe-safe layout (content must affect scrollHeight)

Generate the complete production-ready HTML now.
          `.trim(),
        });

        /* ---------------------------------------------------------- */
        /* CLEAN & SANITIZE HTML */
        /* ---------------------------------------------------------- */

        let finalHtml = text;

        const match = finalHtml.match(/<div[\s\S]*<\/div>/);
        finalHtml = match ? match[0] : finalHtml;
        finalHtml = finalHtml.replace(/```/g, "").trim();

        /* ---------------------------------------------------------- */
        /* SAVE FRAME */
        /* ---------------------------------------------------------- */

        const frame = await prisma.frames.create({
          data: {
            projectId,
            title: screenPlan.name,
            htmlContent: finalHtml,
          },
        });

        return frame;
      });
    }

    return { success: true };
  }
);
