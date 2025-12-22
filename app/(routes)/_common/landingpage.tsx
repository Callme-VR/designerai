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
  const [promptText, setPromptText] = useState("");
  const { mutate, isPending } = useCreateProject();
  const { user } = useKindeBrowserClient();
  const userId=user?.id;
  const { data: projects, isLoading } = useGetProject(userId || "");

  const handleSubmit = () => {
    if (!promptText) return;
    mutate({ prompt: promptText });
  };
  const handleSuggestion = (val: string) => {
    setPromptText(val);
  };

  const suggestions = useMemo(
    () => [
      {
        label: "Finance Tracker",
        icon: "💸",
        value: "Design a finance tracker app...",
      },
      {
        label: "Fitness Activity",
        icon: "🔥",
        value: "Design a fitness activity app...",
      },
      {
        label: "Food Delivery",
        icon: "🍔",
        value: "Design a food delivery app...",
      },
      {
        label: "Travel Booking",
        icon: "✈️",
        value: "Design a travel booking app...",
      },
      { label: "E-Commerce", icon: "🛒", value: "Design an ecommerce app..." },
      { label: "Meditation", icon: "🧘", value: "Design a meditation app..." },
    ],
    []
  );

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

          {/* Prompt */}
          <AIPromptInput
            prompt={promptText}
            setPromptText={setPromptText}
            isLoading={isPending}
            onSubmit={handleSubmit}
          />

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

        <div className="w-full py-10">
          <div className="mx-auto max-w-3xl">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-3">
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
