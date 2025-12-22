import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { Button } from "../ui/button";
import { ArrowLeftIcon, MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignelPageheader({
  projectName,
}: {
  projectName?: string;
}) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="sticky top-0">
      <header className="border-b  border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl">
          <div className="items-center justify-between px-4 flex py-2 ">
            <div className="flex items-center gap-4">
              <Logo />

              <Button
                size={"icon-sm"}
                variant={"ghost"}
                className=" rounded-full bg-muted"
                onClick={() => {
                  router.push("/");
                }}
              >
                <ArrowLeftIcon className="size-4" />
              </Button>

              <p className="inline-block max-w-[200px] truncate font-medium">
                {projectName || "untitled Project"}
              </p>

              <div className="flex items-center gap-2">
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
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}
