"use client";

import { useCanvas } from "@/context/canvas-provider";
import { Button } from "../ui/button";
import { parseThemeColors, ThemeType } from "@/lib/themes";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

function ThemeItem({ theme, isSelected, onSelect }: {
  theme: ThemeType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const colors = parseThemeColors(theme.style);
  
  return (
    <Button 
      onClick={onSelect}
      className={cn(
        "flex items-center justify-between w-full p-3 rounded-xl border gap-4 bg-background hover:bg-muted/50 transition-all duration-200 group",
        isSelected && "border-2 ring-2 ring-primary/20 shadow-lg"
      )}
      style={{
        borderColor: isSelected && colors.primary ? colors.primary : undefined
      }}
    >
      <div className="flex gap-3">
        {["primary", "secondary", "accent", "muted"].map((key) => (
          <div 
            key={key} 
            className="size-5 rounded-full border border-gray-300 shadow-sm group-hover:scale-110 transition-transform"
            style={{
              backgroundColor: colors[key] || "#ccc"
            }}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 flex-1">
        <span className="text-sm font-semibold">
          {theme.name}
        </span>
        {isSelected && (
          <CheckIcon 
            size={18} 
            style={{ color: colors.primary || "currentColor" }} 
            className="animate-pulse"
          />
        )}
      </div>
    </Button>
  );
}

export default function ThemeSelector() {
  const { themes, theme: currentTheme, setTheme } = useCanvas();

  return (
    <div className="flex flex-col max-h-96">
      <div className="flex-1 pb-4 px-6 overflow-y-auto">
        <div className="space-y-1">
          <h2 className="font-semibold text-lg mb-2">Choose A Theme</h2>
          <p className="text-sm text-muted-foreground mb-4">Select a color scheme for your design</p>
        </div>
        <div className="space-y-3 py-2">
          {themes?.map((theme) => (
            <ThemeItem 
              key={theme.id} 
              theme={theme} 
              isSelected={currentTheme?.id === theme.id}
              onSelect={() => setTheme(theme.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
