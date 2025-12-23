import { useCanvas } from "@/context/canvas-provider";
import CanvasProvider from "@/context/canvas-provider";
import FloatingToolBar from "@/context/FloatingToolCanvas";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { parseThemeColors } from "@/lib/themes";
import { useState } from "react";
import { TOOL_MODE_ENUM, ToolModeType } from "@/constant/canvas/canvas";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
} from "react-zoom-pan-pinch";
import CanvasControl from "./CanvasControl";

interface CanvasPageProps {
  projectId: string;
  isPending: boolean;
  projectName: string;
}

export default function CanvasPage({ projectId, isPending }: CanvasPageProps) {
  return (
    <CanvasProvider projectId={projectId}>
      <CanvasPageContent isPending={isPending} />
    </CanvasProvider>
  );
}

function CanvasPageContent({ isPending }: { isPending: boolean }) {
  const { loadingStatus, theme } = useCanvas();

  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.SELECT);
  const [zoomPercent, setZoomPercent] = useState(58);

  const currentStatus = isPending
    ? "Fetching"
    : loadingStatus !== "idle" && loadingStatus !== "completed"
    ? loadingStatus
    : null;

  if (isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      <FloatingToolBar />

      {currentStatus && <CanvasLoader status={currentStatus} />}

      <TransformWrapper
        initialScale={0.58}
        initialPositionX={40}
        initialPositionY={5}
        minScale={0.1}
        maxScale={3}
        wheel={{ step: 0.1 }}
        pinch={{ step: 0.1 }}
        doubleClick={{ disabled: true }}
        centerOnInit={false}
        limitToBounds={false}
        panning={{
          disabled: toolMode !== TOOL_MODE_ENUM.HAND,
        }}
        onTransformed={(ref: ReactZoomPanPinchContentRef) => {
          setZoomPercent(Math.round(100));
        }}
      >
        {({ zoomIn, zoomOut }) => (
          <>
            <TransformComponent
              wrapperStyle={{
                width: "100%",
                height: "100%",
                overflow: "unset",
              }}
              contentStyle={{
                width: "100%",
                height: "100%",
              }}
            >
              <div
                className={cn(
                  "absolute inset-0 h-full w-full p-3",
                  toolMode === TOOL_MODE_ENUM.HAND
                    ? "cursor-grab active:cursor-grabbing"
                    : "cursor-default"
                )}
                style={{
                  backgroundImage: theme
                    ? `radial-gradient(circle, ${
                        parseThemeColors(theme.style)?.primary ??
                        "var(--primary)"
                      } 1px, transparent 1px)`
                    : "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
            </TransformComponent>

            <CanvasControl
              zoomIn={zoomIn}
              zoomOut={zoomOut}
              zoomPercent={zoomPercent}
              toolMode={toolMode}
              setToolMode={setToolMode}
            />
          </>
        )}
      </TransformWrapper>
    </div>
  );
}

function CanvasLoader({ status }: { status: string }) {
  return (
    <div
      className={cn(
        "absolute top-4 left-1/2 z-50 -translate-x-1/2 rounded-bl-xl rounded-br-xl px-4 py-2 shadow-md flex items-center gap-2",
        status === "Fetching"
          ? "bg-gray-700 text-white"
          : "bg-gray-200 text-gray-800"
      )}
    >
      <Spinner className="h-5 w-5" />
      <span className="text-sm font-semibold capitalize">
        {status === "Fetching" ? "Loading Project" : status}
      </span>
    </div>
  );
}
