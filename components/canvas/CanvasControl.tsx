import { TOOL_MODE_ENUM, ToolModeType } from "@/constant/canvas/canvas";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import {
  HandIcon,
  MousePointerIcon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";

interface CanvasControlProps {
  zoomIn: () => void;
  zoomOut: () => void;
  zoomPercent: number;
  toolMode: ToolModeType;
  setToolMode: (mode: ToolModeType) => void;
}

export default function CanvasControl({
  zoomIn,
  zoomOut,
  zoomPercent,
  toolMode,
  setToolMode,
}: CanvasControlProps) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 rounded-full border border-white/10 bg-black/80 px-4 py-2 text-white shadow-lg backdrop-blur">

      {/* Tool mode */}
      <div className="flex items-center gap-1">
        <Button
          size="icon-sm"
          variant="ghost"
          className={cn(
            "hover:bg-white/20",
            toolMode === TOOL_MODE_ENUM.SELECT && "bg-white/20"
          )}
          onClick={() => setToolMode(TOOL_MODE_ENUM.SELECT)}
          title="Select tool"
        >
          <MousePointerIcon className="size-4" />
        </Button>

        <Button
          size="icon-sm"
          variant="ghost"
          className={cn(
            "hover:bg-white/20",
            toolMode === TOOL_MODE_ENUM.HAND && "bg-white/20"
          )}
          onClick={() => setToolMode(TOOL_MODE_ENUM.HAND)}
          title="Hand tool"
        >
          <HandIcon className="size-4" />
        </Button>
      </div>

      <div className="h-6 w-px bg-white/20" />

      {/* Zoom */}
      <div className="flex items-center gap-2">
        <Button
          size="icon-sm"
          variant="ghost"
          className="hover:bg-white/20"
          onClick={zoomOut}
        >
          <MinusIcon className="size-4" />
        </Button>

        <span className="min-w-12 text-center text-xs tabular-nums">
          {zoomPercent}%
        </span>

        <Button
          size="icon-sm"
          variant="ghost"
          className="hover:bg-white/20"
          onClick={zoomIn}
        >
          <PlusIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}
