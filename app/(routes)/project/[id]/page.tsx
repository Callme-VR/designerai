"use client";

import CanvasPage from "@/components/canvas";
import SignelPageheader from "@/components/webcomponents/SignelPageheader";
import { useGetProjectById } from "@/features/use-project-id";
import { useParams } from "next/navigation";

export default function Page() {
  const params = useParams();
  const id = params.id as string;

  const { data: project, isPending } = useGetProjectById(id);
  const frames = project?.frames || "";
  const theme = project?.theme || "";

  if (!isPending && !project) {
    return <div>Project not found </div>;
  }

  return (
    <div className="relative h-screen w-full flex flex-col">
      <SignelPageheader projectName={project?.name}/>


      <div className="flex w-full overflow-hidden">
        <div className="relative">

        </div>
        <CanvasPage />
      </div>
    </div>
  )
}
