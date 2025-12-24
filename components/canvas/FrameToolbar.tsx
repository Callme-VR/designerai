"use client";
import { cn } from "@/lib/utils";
import { CodeIcon, DownloadIcon, GripVertical } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";

type PropsType = {
  title: string;
  isSelected: boolean;
  disabled?: boolean;
  isDownloading: boolean;
  onOpenHtmlDialog: () => void;
  scale?: number;
  onDownloadPng?: () => void;
};

export default function FrameToolbar({
  title,
  isSelected,
  disabled,
  isDownloading,
  scale = 1.7,
  onOpenHtmlDialog,
  onDownloadPng,
}: PropsType) {
  return (
    <div
      className={cn(
        `absolute flex items-center rounded-full z-50 `,
        isSelected
          ? "left:1/2 -translate-x-1/2 border bg-card dark:bg-muted pl-2 pr-4 py-1 shaodow-md min-w-[250px] h-[35px]"
          : "w-[150px h-auto] left-10"
      )}
      style={{
        top: isSelected ? "-70px" : "-39px",
        transformOrigin: "center top",
        transform: `scale(${scale})`,
      }}
    >
      <div
        className="flex items-center gap-2 acctive:cursor-grabbing justify-center flex-[0.8]"
        role="button"
      >
        <GripVertical className="size-4 text-muted-foreground" />

        <div
          className={cn(
            "min-w-20 font-medium text-sm mx-px truncate",
            isSelected && "w-[250px]",
            !isSelected && "w-[150px]"
          )}
        >
          {title}
        </div>
      </div>
      {isSelected && (
        <>
          <Separator className="size-4" orientation="vertical" />
          <div className="flex items-center gap-px">
            <Button
              disabled={disabled}
              size={"icon-sm"}
              variant={"ghost"}
              className="rounded-b-full dark:hover:bg-white/20 hover:bg-muted cursor-pointer"
              onClick={onOpenHtmlDialog}
            >
              <CodeIcon className="size-4" />
            </Button>
            <Button
              disabled={disabled}
              size={"icon-sm"}
              variant={"ghost"}
              className="rounded-b-full dark:hover:bg-white/20 hover:bg-muted cursor-pointer"
              onClick={onDownloadPng}
            >
              {isDownloading ? (
                <Spinner className="size-5" />
              ) : (
                <DownloadIcon className="size-4" />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
