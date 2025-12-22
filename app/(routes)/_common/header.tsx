"use client";

import { Button } from "@/components/ui/button";
import Logo from "@/components/webcomponents/Logo";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Logo />

        {/* Center Nav */}
        <nav className="hidden md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
          >
            Home
          </Link>
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="relative"
          >
            <SunIcon
              className={cn(
                "absolute size-4 transition-all",
                isDark ? "scale-100 opacity-100" : "scale-0 opacity-0"
              )}
            />
            <MoonIcon
              className={cn(
                "absolute size-4 transition-all",
                isDark ? "scale-0 opacity-0" : "scale-100 opacity-100"
              )}
            />
          </Button>

          <LoginLink>
            {" "}
            <Button className="rounded-full px-5">Sign in</Button>
          </LoginLink>
        </div>
      </div>
    </header>
  );
}
