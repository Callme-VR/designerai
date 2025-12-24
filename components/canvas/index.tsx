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
import DeviceFrameSkeleton from "./DeviceFrameSkeleton";
import HtmlDialog from "./HtmlDialog";

const DEMO_HTML = `
<div class=\"flex flex-col w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans pt-12 pb-24 px-6 overflow-y-auto relative\">\n \n <!-- Header -->\n <header class=\"flex justify-between items-center mb-8\">\n <div>\n <p class=\"text-[var(--muted-foreground)] text-xs uppercase tracking-widest font-semibold mb-1\">Welcome Back</p>\n <h1 class=\"text-2xl font-bold tracking-tight text-[var(--foreground)]\">Alex Runner</h1>\n </div>\n <div class=\"h-12 w-12 rounded-full border-2 border-[var(--primary)] p-1 overflow-hidden shadow-[0_0_10px_var(--primary)]\">\n <img src=\"https://i.pravatar.cc/150?img=11\" alt=\"User\" class=\"w-full h-full object-cover rounded-full\" />\n </div>\n </header>\n\n <!-- Central Circular Progress -->\n <div class=\"relative flex items-center justify-center mb-10\">\n <!-- Glow Effect -->\n <div class=\"absolute inset-0 bg-[var(--primary)] opacity-20 blur-3xl rounded-full transform scale-75\"></div>\n \n <div class=\"relative w-64 h-64\">\n <svg class=\"w-full h-full transform -rotate-90\">\n <!-- Background Circle -->\n <circle cx=\"128\" cy=\"128\" r=\"120\" stroke=\"var(--muted)\" stroke-width=\"8\" fill=\"transparent\" />\n <!-- Progress Circle (Steps) -->\n <circle cx=\"128\" cy=\"128\" r=\"120\" stroke=\"var(--primary)\" stroke-width=\"8\" fill=\"transparent\" \n stroke-dasharray=\"753.6\" stroke-dashoffset=\"188\" stroke-linecap=\"round\" \n class=\"drop-shadow-[0_0_8px_var(--primary)]\" />\n <!-- Inner Progress (Calories) -->\n <circle cx=\"128\" cy=\"128\" r=\"100\" stroke=\"var(--muted)\" stroke-width=\"6\" fill=\"transparent\" />\n <circle cx=\"128\" cy=\"128\" r=\"100\" stroke=\"var(--accent)\" stroke-width=\"6\" fill=\"transparent\" \n stroke-dasharray=\"628\" stroke-dashoffset=\"200\" stroke-linecap=\"round\" \n class=\"drop-shadow-[0_0_8px_var(--accent)]\" />\n </svg>\n \n <!-- Center Text -->\n <div class=\"absolute inset-0 flex flex-col items-center justify-center\">\n <iconify-icon icon=\"lucide:footprints\" class=\"text-[var(--primary)] text-3xl mb-1\"></iconify-icon>\n <span class=\"text-5xl font-black italic tracking-tighter text-[var(--foreground)]\">8,432</span>\n <span class=\"text-[var(--muted-foreground)] text-sm font-medium uppercase tracking-widest\">Steps</span>\n <div class=\"mt-2 flex items-center gap-1 text-[var(--accent)]\">\n <iconify-icon icon=\"lucide:flame\" width=\"14\"></iconify-icon>\n <span class=\"text-sm font-bold\">420 kcal</span>\n </div>\n </div>\n </div>\n </div>\n\n <!-- Heart Rate Graph -->\n <div class=\"mb-6\">\n <div class=\"flex justify-between items-end mb-4\">\n <h2 class=\"text-lg font-bold flex items-center gap-2\">\n <iconify-icon icon=\"lucide:activity\" class=\"text-[var(--accent)]\"></iconify-icon>\n Heart Rate\n </h2>\n <span class=\"text-[var(--accent)] font-mono font-bold text-xl drop-shadow-[0_0_5px_var(--accent)]\">112 BPM</span>\n </div>\n <div class=\"h-32 w-full bg-[var(--card)] rounded-[var(--radius)] border border-[var(--muted)] relative overflow-hidden p-4 flex items-end\">\n <!-- Grid Lines -->\n <div class=\"absolute inset-0 grid grid-rows-4 w-full h-full opacity-10 pointer-events-none\">\n <div class=\"border-b border-[var(--foreground)]\"></div>\n <div class=\"border-b border-[var(--foreground)]\"></div>\n <div class=\"border-b border-[var(--foreground)]\"></div>\n </div>\n <!-- Graph Line (SVG representation) -->\n <svg class=\"w-full h-full overflow-visible\" preserveAspectRatio=\"none\">\n <path d=\"M0,80 C20,80 40,50 60,60 S100,20 120,40 S160,80 180,70 S220,10 240,30 S280,60 350,50\" \n fill=\"none\" stroke=\"var(--accent)\" stroke-width=\"3\" \n class=\"drop-shadow-[0_0_6px_var(--accent)]\" />\n <!-- Area under curve -->\n <path d=\"M0,80 C20,80 40,50 60,60 S100,20 120,40 S160,80 180,70 S220,10 240,30 S280,60 350,50 V150 H0 Z\" \n fill=\"var(--accent)\" fill-opacity=\"0.1\" />\n </svg>\n </div>\n </div>\n\n <!-- Metrics Grid -->\n <div class=\"grid grid-cols-2 gap-4\">\n <!-- Sleep Card -->\n <button class=\"bg-[var(--card)] p-5 rounded-[var(--radius)] border border-[var(--muted)] flex flex-col items-start active:scale-95 transition-transform\">\n <div class=\"bg-[var(--muted)] p-2 rounded-full mb-3 text-[var(--primary)]\">\n <iconify-icon icon=\"lucide:moon\" width=\"24\" height=\"24\"></iconify-icon>\n </div>\n <span class=\"text-[var(--muted-foreground)] text-xs font-bold uppercase\">Sleep</span>\n <span class=\"text-xl font-bold text-[var(--foreground)]\">7h 20m</span>\n </button>\n\n <!-- Water Card -->\n <button class=\"bg-[var(--card)] p-5 rounded-[var(--radius)] border border-[var(--muted)] flex flex-col items-start active:scale-95 transition-transform\">\n <div class=\"bg-[var(--muted)] p-2 rounded-full mb-3 text-[var(--accent)]\">\n <iconify-icon icon=\"lucide:droplets\" width=\"24\" height=\"24\"></iconify-icon>\n </div>\n <span class=\"text-[var(--muted-foreground)] text-xs font-bold uppercase\">Water</span>\n <span class=\"text-xl font-bold text-[var(--foreground)]\">1,250ml</span>\n </button>\n\n <!-- SpO2 Card -->\n <button class=\"col-span-2 bg-[var(--card)] p-4 rounded-[var(--radius)] border border-[var(--muted)] flex items-center justify-between active:scale-95 transition-transform\">\n <div class=\"flex items-center gap-4\">\n <div class=\"bg-[var(--muted)] p-2 rounded-full text-white\">\n <iconify-icon icon=\"lucide:wind\" width=\"24\" height=\"24\"></iconify-icon>\n </div>\n <div class=\"flex flex-col text-left\">\n <span class=\"text-[var(--muted-foreground)] text-xs font-bold uppercase\">SpO2 Levels</span>\n <span class=\"text-lg font-bold text-[var(--foreground)]\">98% Normal</span>\n </div>\n </div>\n <div class=\"h-2 w-24 bg-[var(--muted)] rounded-full overflow-hidden\">\n <div class=\"h-full w-[98%] bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]\"></div>\n </div>\n </button>\n </div>\n\n <!-- Bottom Navigation (Fixed) -->\n <nav class=\"mobile-bottom-nav\">\n <a href=\"#\" class=\"mobile-bottom-nav-item active\">\n <iconify-icon icon=\"lucide:home\"></iconify-icon>\n <span>Home</span>\n <div class=\"nav-indicator\"></div>\n </a>\n <a href=\"#\" class=\"mobile-bottom-nav-item\">\n <iconify-icon icon=\"lucide:activity\"></iconify-icon>\n <span>Stats</span>\n <div class=\"nav-indicator\"></div>\n </a>\n <a href=\"#\" class=\"mobile-bottom-nav-item\">\n <iconify-icon icon=\"lucide:dumbbell\"></iconify-icon>\n <span>Gym</span>\n <div class=\"nav-indicator\"></div>\n </a>\n <a href=\"#\" class=\"mobile-bottom-nav-item\">\n <iconify-icon icon=\"lucide:user\"></iconify-icon>\n <span>Profile</span>\n <div class=\"nav-indicator\"></div>\n </a>\n </nav>\n\n</div>

`;

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
  const[onOpenHtmlDialog,setOpenHtmlDialog]=useState(false)
  // Only show loader for AI generation/analysis, not for normal viewing
  const currentStatus = isPending
    ? "Fetching"
    : loadingStatus === "analyzing" || loadingStatus === "generating"
    ? loadingStatus
    : null;

    const onOpenHtmlDialog=()=>{
        setOpenHtmlDialog(true)
    }

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
                    onOpenHtmlDialog={onOpenHtmlDialog}
                  />
                  if(frames.isLoading){
                    return(
                      <DeviceFrameSkeleton key={index}
                      style={{
                        tranform:`translate(${100 + index * 450}px, ${100}px)`
                      }} />
                    )
                  }
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
    <HtmlDialog html={selectFrame?.htmlContent || DEMO_HTML}
    theme_style={theme?.style}/>
    open={openHtmlDialog}
    onchange={setOpenHtmlDialog}
    />
<>

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
