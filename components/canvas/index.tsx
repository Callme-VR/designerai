import { useCanvas } from "@/context/canvas-provider";
import CanvasProvider from "@/context/canvas-provider";
import FloatingToolBar from "@/context/FloatingToolCanvas";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { parseThemeColors } from "@/lib/themes";
import { useState } from "react";
import { TOOL_MODE_ENUM, ToolModeType } from "@/constant/canvas/canvas";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import CanvasControl from "./CanvasControl";
import DeviceFrames from "./device-frame";
import { FrameType } from "@/types/project";

interface CanvasPageProps {
  projectId: string;
  isPending: boolean;
  projectName: string;
  initialFrames?: FrameType[];
  initialThemeId?: string;
  hasInitialData?: boolean;
}

export default function CanvasPage({
  projectId,
  isPending,
  initialFrames = [],
  initialThemeId,
  hasInitialData = false,
}: CanvasPageProps) {
  return (
    <CanvasProvider
      projectId={projectId}
      initialFrames={initialFrames}
      initialThemeId={initialThemeId}
      hasInitialData={hasInitialData}
    >
      <CanvasPageContent isPending={isPending} />
    </CanvasProvider>
  );
}

function CanvasPageContent({ isPending }: { isPending: boolean }) {
  const { loadingStatus, theme, frames } = useCanvas();

  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.SELECT);
  const [zoomPercent, setZoomPercent] = useState(58);

  // Only show loader for AI generation/analysis, not for normal viewing
  const currentStatus = isPending
    ? "Fetching"
    : loadingStatus === "analyzing" || loadingStatus === "generating"
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
        onTransformed={(ref) => {
          setZoomPercent(Math.round(ref.instance.transformState.scale * 100));
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
                  "w-[3000px] h-[3000px] relative",
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
                  backgroundColor: theme
                    ? parseThemeColors(theme.style)?.background ?? "#f8f9fa"
                    : "#f8f9fa",
                }}
              >
                {frames.map((frame, index) => (
                  <DeviceFrames
                    key={frame.id}
                    frameId={frame.id}
                    html={frame.htmlContent}
                    title={frame.name}
                    initialPosition={{ x: 100 + index * 450, y: 100 }}
                    scale={zoomPercent / 100}
                    toolMode={toolMode}
                    theme_style={theme?.style}
                  />
                ))}
              </div>
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
        "absolute top-28 left-1/2 z-50 -translate-x-1/2 rounded-xl px-4 py-2 shadow-md flex items-center gap-2",
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
