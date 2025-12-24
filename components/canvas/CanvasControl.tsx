import { TOOL_MODE_ENUM, ToolModeType } from "@/constant/canvas/canvas";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { HandIcon, MousePointerIcon, MinusIcon, PlusIcon } from "lucide-react";
import { Separator } from "../ui/separator";

type CanvasControlPropsType = {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomPercent: number;
  toolMode: ToolModeType;
  setToolMode: (toolMode: ToolModeType) => void;
};

export default function CanvasControl({
  zoomIn,
  zoomOut,
  zoomPercent,
  toolMode,
  setToolMode,
}: CanvasControlPropsType) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-white shadow-lg backdrop-blur">
      {/* Tool mode */}
      <div className="flex items-center gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          className={cn(
            "hover:bg-white/20 text-white cursor-pointer rounded-full",
            toolMode === TOOL_MODE_ENUM.SELECT && "bg-white/20"
          )}
          onClick={() => setToolMode(TOOL_MODE_ENUM.SELECT)}
        >
          <MousePointerIcon className="size-4" />
        </Button>

        <Button
          size="icon-sm"
          variant="ghost"
          className={cn(
            "hover:bg-white/20 text-white cursor-pointer rounded-full",
            toolMode === TOOL_MODE_ENUM.HAND && "bg-white/20"
          )}
          onClick={() => setToolMode(TOOL_MODE_ENUM.HAND)}
        >
          <HandIcon className="size-4" />
        </Button>
      </div>

      <Separator className="h-5! bg-white/20" orientation="vertical" />

      <div className="flex items-center gap-2">
        <Button
          size="icon-sm"
          variant="ghost"
          className="hover:bg-white/20 cursor-pointer text-white rounded-full"
          onClick={() => zoomOut()}
        >
          <MinusIcon className="size-4" />
        </Button>

        <span className="min-w-12 text-center text-xs tabular-nums">
          {zoomPercent}%
        </span>

        <Button
          size="icon-sm"
          variant="ghost"
          className={cn(
            "hover:bg-white/20 cursor-pointer text-white rounded-full"
          )}
          onClick={() => zoomIn()}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
