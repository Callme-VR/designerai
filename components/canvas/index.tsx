import { useCanvas } from "@/context/canvas-provider";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import FloatingToolCanvas from "@/context/FloatingToolCanvas";

interface CanvasPageProps {
  projectId: string;
  isPending: boolean;
  projectName: string;
}

export default function CanvasPage({
  projectId,
  isPending,
  projectName,
}: CanvasPageProps) {
  const { loadingStatus } = useCanvas();

  //   something missing here which is related to thems,setframes props

  const currentStatus = isPending
    ? "Fetching"
    : loadingStatus !== "idle" && loadingStatus !== "completed"
    ? loadingStatus
    : null;

  if (isPending) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <FloatingToolCanvas />
      {currentStatus && <CanvasLoader status={currentStatus} />}
      <div
        className="absolute inset-0 w-full h-full bg-[#eee] dark:bg-[#242423] p-3"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
    </div>
  );
}

function CanvasLoader({ status }: { status: string }) {
  return (
    <div
      className={cn(
        "absolute top-4 left-1/2 -translate-x-1/2 min-w-40 max-w-full px-4 py-2 rounded-br-xl rounded-bl-xl shadow-md flex items-center space-x-2 z-50",
        status === "Fetching"
          ? "bg-gray-600 text-white"
          : "bg-gray-200 text-gray-800"
      )}
    >
      <Spinner
        className={cn(
          "w-5 h-5",
          status === "Fetching" ? "text-white" : "text-gray-800"
        )}
      />
      <span className="text-sm font-semibold capitalize">
        {status === "Fetching" ? "Loading Project" : status}
      </span>
    </div>
  );
}
