"use client";

import Header from "./header";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import AIPromptInput from "@/components/webcomponents/aipromptinput";
import { useCreateProject, useGetProject } from "@/features/use-project";
import { useMemo, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { ProjectType } from "@/types/project";
import ProjectCard from "@/components/webcomponents/ProjectCard";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

export default function LandingPage() {
  const [promptText, setPromptText] = useState<string>("");
  const { mutate, isPending } = useCreateProject();
  const { user } = useKindeBrowserClient();
  const userId = user?.id;
  const { data: projects, isLoading } = useGetProject(userId || "");

  const handleSubmit = () => {
    if (!promptText) return;
    mutate({ prompt: promptText });
  };
  const handleSuggestion = (val: string) => {
    setPromptText(val);
  };

  const suggestions = [
    {
      label: "Finance Tracker",
      icon: "💸",
      value: `Finance app statistics screen. Current balance at top with dollar amount, bar chart showing spending over months (Oct-Mar) with month selector pills below, transaction list with app icons, amounts, and categories. Bottom navigation bar. Mobile app, single screen. Style: Dark theme, chunky rounded cards, playful but professional, modern sans-serif typography, Gen Z fintech vibe. Fun and fresh, not corporate.`,
    },
    {
      label: "Fitness Activity",
      icon: "🔥",
      value: `Fitness tracker summary screen. Large central circular progress ring showing steps and calories with neon glow. Line graph showing heart rate over time. Bottom section with grid of health metrics (Sleep, Water, SpO2). Mobile app, single screen. Style: Deep Dark Mode (OLED friendly). Pitch black background with electric neon green and vibrant blue accents. High contrast, data-heavy but organized, sleek and sporty aesthetic.`,
    },
    {
      label: "Food Delivery",
      icon: "🍔",
      value: `Food delivery home feed. Top search bar with location pin. Horizontal scrolling hero carousel of daily deals. Vertical list of restaurants with large delicious food thumbnails, delivery time badges, and rating stars. Floating Action Button (FAB) for cart. Mobile app, single screen. Style: Vibrant and Appetizing. Warm colors (orange, red, yellow), rounded card corners, subtle drop shadows to create depth. Friendly and inviting UI.`,
    },
    {
      label: "Travel Booking",
      icon: "✈️",
      value: `Travel destination detail screen. Full-screen immersive photography of a tropical beach. Bottom sheet overlay with rounded top corners containing hotel title, star rating, price per night, and a large "Book Now" button. Horizontal scroll of amenity icons. Mobile app, single screen. Style: Minimalist Luxury. ample whitespace, elegant serif typography for headings, clean sans-serif for body text. Sophisticated, airy, high-end travel vibe.`,
    },
    {
      label: "E-Commerce",
      icon: "👟",
      value: `Sneaker product page. Large high-quality product image on a light gray background. Color selector swatches, size selector grid, and a sticky "Add to Cart" button at the bottom. Title and price in bold, oversized typography. Mobile app, single screen. Style: Neo-Brutalism. High contrast, thick black outlines on buttons and cards, hard shadows (no blur), unrefined geometry, bold solid colors (yellow and black). Trendy streetwear aesthetic.`,
    },
    {
      label: "Meditation",
      icon: "🧘",
      value: `Meditation player screen. Central focus is a soft, abstract breathing bubble animation. Play/Pause controls and a time slider below. Background is a soothing solid pastel sage green. Mobile app, single screen. Style: Soft Minimal. Rounded corners on everything, low contrast text for relaxation, pastel color palette, very little UI clutter. Zen, calming, and therapeutic atmosphere.`,
    },
  ];

  return (
    <>
      <Header />

      <main className="relative flex min-h-screen flex-col items-center justify-center px-4">
        <div className="mx-auto w-full max-w-4xl space-y-10 text-center">
          {/* Hero */}
          <section className="space-y-4">
            <h1 className="text-4xl font-semibold sm:text-5xl lg:text-6xl">
              Design mobile apps <br />
              <span className="text-primary">in minutes</span>
            </h1>

            <p className="mx-auto max-w-2xl text-muted-foreground">
              Go from idea to beautiful app mockups in minutes by chatting with
              AI.
            </p>
          </section>

          <div className="w-full">
            {/* Prompt */}
            <AIPromptInput
              promptText={promptText}
              setPromptText={setPromptText}
              isLoading={isPending}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Suggestions */}
          <Suggestions>
            {suggestions.map((s) => (
              <Suggestion
                key={s.label}
                onClick={() => handleSuggestion(s.value)}
                suggestion={s.value}
              >
                {s.icon} {s.label}
              </Suggestion>
            ))}
          </Suggestions>
        </div>
        <Separator className="w-fit size-1 mt-7" />

        <div className="w-full py-12">
          <div className="mx-auto max-w-4xl px-4">
            {projects && (
              <div>
                <h1 className="tracking-tighter font-bold text-2xl text-center">
                  Recent Projects
                </h1>
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Spinner className="size-10" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
                    {projects?.map((project: ProjectType) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
