"use client"

import { cn } from "@/lib/utils"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "../ui/input-group"
import { Spinner } from "../ui/spinner"
import { CornerDownLeftIcon } from "lucide-react"

interface AIPromptInputProps {
  className?: string
  prompt: string
  setPromptText: (value: string) => void
  isLoading: boolean
  hiddenSubmitBtn: boolean
  onSubmit: () => void
}

export default function AIPromptInput({
  className,
  prompt,
  setPromptText,
  isLoading,
  hiddenSubmitBtn,
  onSubmit,
}: AIPromptInputProps) {
  return (
    <div className="bg-background">
      <InputGroup className={cn("min-h-[172px] rounded-3xl bg-background", className)}>
        <InputGroupTextarea
          className="py-2.5 text-base"
          placeholder="Describe the app you want to design…"
          value={prompt}
          onChange={(e) => setPromptText(e.target.value)}
          aria-label="App design prompt"
        />

        <InputGroupAddon className="flex items-center justify-end" align="block-end">
          {!hiddenSubmitBtn && (
            <InputGroupButton
              size="sm"
              disabled={!prompt?.trim() || isLoading}
              onClick={onSubmit}
            >
              {isLoading ? (
                <Spinner className="size-5" />
              ) : (
                <>
                  Design
                  <CornerDownLeftIcon className="size-5" />
                </>
              )}
            </InputGroupButton>
          )}
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}
