"use client";

import CanvasPage from "@/components/canvas";
import SignelPageheader from "@/components/webcomponents/SignelPageheader";
import CanvasProvider from "@/context/canvas-provider";
import { useGetProjectById } from "@/features/use-project-id";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params.id as string;
  const { data: project, isPending } = useGetProjectById(id);
  // const frames = project?.frames || [];
  // const themeId = project?.theme || "";
  const hasInitialData = frames.length > 0;

  if (!isPending && !project) {
    return <div>Project not found </div>;
  }

  return (
    <div className="relative h-screen w-full flex flex-col">
      <SignelPageheader projectName={project?.name} />

      <div className="flex-1 w-full overflow-hidden">
        {/* diffrent componnet coming from context/canvas-provider */}
        <CanvasProvider
          projectId={id}
          initialFrames={project?.frames || []}
          initialThemeId={project?.theme || ""}
          hasInitialData={hasInitialData}
        >
          {/* diffrent componnet coming from components/canvas */}
          <div className="flex flex-1 overflow-hidden">
            <div className="relative flex-1">
              <CanvasPage
                projectId={project?.id}
                projectName={project?.name}
                isPending={isPending}
              />
            </div>
          </div>
        </CanvasProvider>
      </div>
    </div>
  );
}
