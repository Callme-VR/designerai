"use client";

import Header from "./header";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import AIPromptInput from "@/components/webcomponents/aipromptinput";
import { useCreateProject, useGetProject } from "@/features/use-project";
import { useMemo, useState } from "react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const user = useKindeBrowserClient();
  const [promptText, setPromptText] = useState("");
  const { mutate, isPending } = useCreateProject();

  const userId = user?.id;

  const { data: projects, isLoading, isError } = useGetProject(userId);


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
                suggestion={""}
              >
                {s.icon} {s.label}
              </Suggestion>
            ))}
          </Suggestions>
        </div>
      </main>
    </>
  );
}
