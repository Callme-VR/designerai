"use client";

import { TOOL_MODE_ENUM, ToolModeType } from "@/constant/canvas/canvas";
import { getHTMLWrapper } from "@/lib/frame-wrapper";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import FrameToolbar from "./FrameToolbar";

type PropsType = {
  html: string;
  title?: string;
  width?: number;
  minHeight?: number | string;
  initialPosition?: { x: number; y: number };
  frameId: string;
  scale: number;
  toolMode: ToolModeType;
  theme_style?: string;
  onOpenHtmlDialog: () => void;
};

export default function DeviceFrames({
  html,
  title = "untitled",
  width = 420,
  minHeight = 800,
  initialPosition = { x: 0, y: 0 },
  frameId = "",
  scale = 1,
  toolMode,
  theme_style,
  onOpenHtmlDialog,
}: PropsType) {
  const [selectedFrameId, setSelectedFrameId] = useState<string>("");
  const [frameSize, setFrameSize] = useState({
    width: width,
    minHeight: typeof minHeight === "string" ? parseInt(minHeight) : minHeight,
  });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isSelected = selectedFrameId === frameId;
  const fullHtml = getHTMLWrapper(html, title, theme_style, frameId);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data.type === "FRAME_HEIGHT_CHANGE" &&
        event.data.id === frameId
      ) {
        setFrameSize((prev) => {
          return {
            ...prev,
            height: event.data.height,
          };
        });
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [frameId]);

  const Handle = () => {
    return (
      <div className="z-30 h-4 w-4 bg-white border border-blue-600 rounded-full" />
    );
  };

  return (
    <Rnd
      default={{
        x: initialPosition.x,
        y: initialPosition.y,
        width: frameSize.width,
        height: frameSize.minHeight,
      }}
      minWidth={width}
      minHeight={minHeight}
      size={{
        width: frameSize.width,
        height: frameSize.minHeight,
      }}
      disableDragging={toolMode === TOOL_MODE_ENUM.HAND}
      enableResizing={toolMode === TOOL_MODE_ENUM.SELECT}
      scale={scale}
      onClick={(e: any) => {
        e.stopPropagation();
        if (toolMode === TOOL_MODE_ENUM.SELECT) {
          setSelectedFrameId(frameId);
        }
      }}
      resizeHandleComponent={{
        topLeft: isSelected ? <Handle /> : undefined,
        topRight: isSelected ? <Handle /> : undefined,
        bottomLeft: isSelected ? <Handle /> : undefined,
        bottomRight: isSelected ? <Handle /> : undefined,
      }}
      resizeHandleStyles={{
        top: { cursor: "ns-resize" },
        bottom: { cursor: "ns-resize" },
        left: { cursor: "ew-resize" },
        right: { cursor: "ew-resize" },
      }}
      onResize={(e, direction, ref) => {
        setFrameSize({
          width: parseInt(ref.style.width),
          minHeight: parseInt(ref.style.height),
        });
      }}
      className={cn(
        `relative z-10`,
        isSelected &&
          toolMode !== TOOL_MODE_ENUM.HAND &&
          "ring-3 ring-blue-400 ring-offset-1",
        toolMode === TOOL_MODE_ENUM.HAND
          ? "cursor-grab active:cursor-grabbing"
          : "cursor-move"
      )}
    >
      <div className="w-full h-full">
        <FrameToolbar
          title={title}
          isSelected={isSelected}
          disabled={toolMode === TOOL_MODE_ENUM.HAND}
          isDownloading={false}
          onOpenHtmlDialog={onOpenHtmlDialog}
          scale={scale}
          onDownloadPng={false}
        />

        <div
          className={cn(
            "relative w-full h-auto shadow-md rounded-[36px] overflow-hidden"
          )}
        >
          <iframe
            ref={iframeRef}
            srcDoc={fullHtml}
            title={title}
            sandbox="allow-scripts allow-same-origin"
            style={{
              width: "100%",
              minHeight: `${minHeight}px`,
              height: `${frameSize.minHeight}px`,
              border: "none",
              pointerEvents: "none",
              display: "block",
              background: "white",
            }}
          />
        </div>
      </div>
    </Rnd>
  );
}
