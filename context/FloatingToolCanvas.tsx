"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCanvas } from "./canvas-provider";
import { Button } from "@/components/ui/button";
import { Palette, Wand2 } from "lucide-react";
import AIPromptInput from "@/components/webcomponents/aipromptinput";
import { useState } from "react";
import { parseThemeColors } from "@/lib/themes";
import { cn } from "@/lib/utils";

export default function FloatingToolBar() {
  const { theme: currentTheme, themes, setTheme } = useCanvas();
  const [prompt, setPromptText] = useState<string>("");

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <div className="w-full max-w-2xl bg-background dark:bg-gray-950 rounded-full shadow-xl border">
        <div className="flex flex-row items-center gap-3 px-4 py-1">
          {/* AI Prompt Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size={"sm"}
                className="px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl shadow-lg shadow-purple-200/50 hover:shadow-purple-200/70 transition-all"
              >
                <Wand2 className="size-4 mr-2" />
                AI Generate
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-4 rounded-xl shadow-lg border mt-2">
              <AIPromptInput
                prompt={prompt}
                setPromptText={setPromptText}
                isLoading={false}
                onSubmit={() => {}}
                hideSubmitBtn={true}
                className="min-h-[150px] ring-1 ring-purple-400 rounded-xl shadow-none border-muted mb-3"
              />
              <Button 
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg shadow-purple-200/50 hover:shadow-purple-200/70 transition-all"
                onClick={() => {}}
              >
                Generate
              </Button>
            </PopoverContent>
          </Popover>

          {/* Theme Selector Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full px-3 h-9 flex items-center gap-2 border-muted bg-background hover:bg-muted/50"
              >
                <Palette className="size-4" />
                <span className="text-sm">Theme</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3 rounded-xl shadow-lg border mt-2">
              <div className="flex flex-col gap-2">
                <h4 className="font-medium text-sm mb-2">Select Theme</h4>
                <div className="grid grid-cols-4 gap-3">
                  {themes?.slice(0, 8)?.map((theme) => {
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
                          "w-full aspect-square rounded-lg flex items-center justify-center transition-all",
                          "border-2 hover:ring-2 hover:ring-offset-2 hover:ring-primary/50",
                          isActive 
                            ? "border-primary ring-2 ring-offset-1 ring-primary/30" 
                            : "border-muted"
                        )}
                        style={{
                          backgroundColor: colors?.background,
                          color: colors?.text
                        }}
                        title={theme.name}
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: colors?.primary }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
