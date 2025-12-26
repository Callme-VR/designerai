"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCanvas } from "../../context/canvas-provider";
import { Button } from "@/components/ui/button";
import { CameraIcon, Palette, Save, Wand2 } from "lucide-react";
import AIPromptInput from "@/components/webcomponents/aipromptinput";
import { useState } from "react";
import { parseThemeColors } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  useGenrateDesignById,
  useUpdateProject,
} from "@/features/use-project-id";
import { Spinner } from "../ui/spinner";

export default function FloatingToolBar({ projectId }: { projectId: string }) {
  const { theme: currentTheme, themes, setTheme } = useCanvas();
  const [prompt, setPromptText] = useState<string>("");

  const { mutate, isPending } = useGenrateDesignById(projectId);
  const update = useUpdateProject(projectId);

  const handleAiGenration = () => {
    if (!prompt) return;
    mutate(prompt);
  };

  const handleUpdateProject = () => {
    if (!prompt) return;
    update.mutate(currentTheme?.id);
  };

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 mt-4">
      <div className="w-full max-w-3xl bg-background/95 backdrop-blur-sm dark:bg-gray-950/95 rounded-2xl shadow-2xl border border-border/50">
        <div className="flex flex-row items-center gap-6 px-6 py-3">
          {/* AI Prompt Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="sm"
                className="px-5 py-2.5 bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-purple-200/50 hover:shadow-purple-200/70 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium"
              >
                <Wand2 className="size-4 mr-2" />
                AI Generate
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-96 p-6 rounded-2xl shadow-2xl border border-border/50 mt-3 bg-background/95 backdrop-blur-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-base mb-2">
                    AI Design Assistant
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Describe what you want to create and let AI generate it for
                    you
                  </p>
                </div>
                <AIPromptInput
                  promptText={prompt}
                  setPromptText={setPromptText}
                  isLoading={false}
                  onSubmit={handleAiGenration}
                  hideSubmitBtn={false}
                  className="min-h-[120px] ring-2 ring-purple-400/20 rounded-xl shadow-none border-muted mb-4"
                />
                <Button
                  className="w-full bg-linear-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-purple-200/50 hover:shadow-purple-200/70 hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium py-3"
                  onClick={handleAiGenration}
                >
                  <Wand2 className="size-4 mr-2" />
                  Generate Design
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Theme Selector Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl px-4 py-2.5 h-auto flex items-center gap-2 border-border/50 bg-background  transition-all duration-200"
              >
                <Palette className="size-4" />
                <span className="text-sm font-medium">Theme</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-6 rounded-2xl shadow-2xl border border-border/50 mt-3 bg-background/95 backdrop-blur-sm">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-base mb-3">Choose Theme</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a color scheme for your design
                  </p>
                </div>
                <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-2">
                  {themes?.map((theme) => {
                    const colors = parseThemeColors(theme.style);
                    const isActive = currentTheme?.id === theme.id;

                    return (
                      <button
                        key={theme.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setTheme(theme.id);
                        }}
                        className={cn(
                          "w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-200 group",
                          "border-2 hover:scale-105 hover:ring-2 hover:ring-offset-2 hover:ring-primary/30",
                          isActive
                            ? "border-primary ring-2 ring-offset-2 ring-primary/30 shadow-lg"
                            : "border-border/50 hover:border-border"
                        )}
                        style={{
                          backgroundColor: colors?.background || "#fff",
                          color: colors?.foreground || "#000",
                        }}
                        title={theme.name}
                      >
                        <div
                          className="w-3 h-3 rounded-full shadow-sm group-hover:scale-110 transition-transform"
                          style={{ backgroundColor: colors?.primary || "#000" }}
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="pt-2 border-t border-border/50">
                  <p className="text-xs text-muted-foreground text-center">
                    All {themes?.length || 0} themes available
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Separator className="h-8" orientation="vertical" />

          <div className="flex items-center gap-7">
            <Button
              className="rounded-xl cursor-pointer border-border/50 bg-background transition-all duration-200 shadow-sm hover:shadow-md"
              variant="outline"
              size="icon"
              onClick={() => {
                // TODO: Implement screenshot functionality
                console.log("Screenshot clicked");
              }}
            >
              <CameraIcon className="size-4" />
            </Button>

            <Button
              className="rounded-xl cursor-pointer bg-linear-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl px-4 py-2.5"
              variant="default"
              size="sm"
              onClick={handleUpdateProject}
            >
              {update.isPending ? (
                <Spinner />
              ) : (
                <>
                  <Save className="size-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
