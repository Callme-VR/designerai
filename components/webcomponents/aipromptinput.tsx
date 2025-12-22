"use client"

import { cn } from "@/lib/utils"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "../ui/input-group"
import { Spinner } from "../ui/spinner"
import { CornerDownLeftIcon } from "lucide-react"

interface PropType {
    className?: string,
    prompt: string
    setPromptText: (value: string) => void
    isLoading: boolean
    hiddenSubmitBtn: boolean
    onSubmit: () => void
}

export default function Aipromptinput(props: PropType) {
    return (
        <div className="bg-background">

            <InputGroup className={cn("min-h-[172px] bg-background rounded-3xl", props.className)}>

                <InputGroupTextarea className="text-base py-2.5"
                    placeholder="I want to design an App"
                    value={props.prompt}
                    onChange={(e) => props.setPromptText(e.target.value)}
                />

                <InputGroupAddon className="flex items-center justify-end" align="block-end">
                    {!props.hiddenSubmitBtn && (
                        <InputGroupButton 
                            className="" 
                            size="sm" 
                            disabled={!props.prompt?.trim() || props.isLoading} 
                            onClick={() => props.onSubmit()}
                        >
                            {props.isLoading ? (
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
