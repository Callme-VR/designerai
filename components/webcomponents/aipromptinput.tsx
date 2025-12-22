"use client"

import { CornerDownLeftIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Spinner } from "../ui/spinner"

interface Props {
  prompt: string | undefined
  setPromptText: (v: string) => void
  isLoading: boolean
  onSubmit: () => void
  className?: string
}

export default function AIPromptInput({
  prompt,
  setPromptText,
  isLoading,
  onSubmit,
  className,
}: Props) {
  return (
    <div className="relative w-full">
      <textarea
        className={cn(
          "min-h-[160px] w-full resize-none rounded-3xl border bg-background px-5 py-4 pr-28 text-base outline-none focus:ring-2 focus:ring-primary",
          className
        )}
        placeholder="I want to design an app that..."
        value={prompt || ""}
        onChange={(e) => setPromptText(e.target.value)}
      />

      {/* Design Button */}
      <button
        onClick={onSubmit}
        disabled={!prompt?.trim() || isLoading}
        className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:opacity-90 disabled:opacity-50"
      >
        {isLoading ? (
          <Spinner className="size-4" />
        ) : (
          <>
            Design
            <CornerDownLeftIcon className="size-4" />
          </>
        )}
      </button>
    </div>
  )
}
