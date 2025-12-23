"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import Logo from "@/components/webcomponents/Logo";
import { LogOutIcon, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { user } = useKindeBrowserClient();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Logo />

        {/* Center Nav */}
        <nav className="hidden md:flex">
          <Link
            href="/"
            className={buttonVariants({ variant: "ghost" })}
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
            className="relative cursor-pointer"
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

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="shrink-0 rounded-full size-7">
                  <AvatarImage
                    src={user?.picture || ""}
                    alt={user?.given_name?.charAt(0)}
                  />

                  <AvatarFallback>
                    {user?.given_name?.charAt(0)}
                    {user?.family_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogoutLink className="w-full flex items-center">
                    <LogOutIcon size="5" />
                    <span>Logout</span>
                  </LogoutLink>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginLink>
              {" "}
              <Button className="rounded-full px-5 cursor-pointer">Sign in</Button>
            </LoginLink>
          )} 
        </div>
      </div>
    </header>
  );
}
