"use client"

import { Button } from "@/components/ui/button";
import Logo from "@/components/webcomponents/Logo";
import { cn } from "@/lib/utils";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes"
import Link from "next/link";

export default function Header() {
  const { theme, setTheme } = useTheme()

  const isDark = theme === "dark";






  return (
    <div className="sticky top-0 right-0 left-0 z-30">
      <header className="h-16 border-b bg-background py-4">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between p-4">
          <Logo />


          <div className="flex-1 items-center justify-center gap-8 md:flex">
            <Link href={"/"} className="text-muted-foreground text-sm">Home</Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3">
            <Button variant={"outline"} size={"icon"} onClick={() => setTheme(isDark ? "light" : "dark")} className="relative rounded-full w-8">
              <SunIcon className={cn("size-5 absolute transition", (
                isDark ? "scale-100" : "scale-0"
              ))} />
              <MoonIcon className={cn("size-5 absolute transition", (
                isDark ? "scale-0" : "scale-100"
              ))} />


            </Button>
          </div>

        </div>

      </header>

    </div>
  )
}
