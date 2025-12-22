/* eslint-disable @next/next/no-img-element */
import { ProjectType } from "@/types/project";
import { FolderOpenDotIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

export default function ProjectCard({ project }: { project: ProjectType }) {
  const router = useRouter();
  const createdAtDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });

  const thumbnail = project.thumbnail || null;

  const onRoute = () => {
    router.push(`/project/${project.id}`);
  };

  return (
    <div
      role="button"
      className="w-full flex flex-col rounded-xl cursor-pointer hover:shadow-md overflow-hidden"
      onClick={onRoute}
    >
      <div className="h-40 bg-[#eee] relative overflow-hidden flex items-center justify-center">
        {thumbnail ? (
          <img
            src={thumbnail}
            className="w-full h-full object-cover object-left scale-110 transition-all duration-300"
          />
        ) : (
          <div className="w-16 h-16 bg-primary/100 scale-110 transition-all duration-300 rounded-full flex items-center justify-center">
            <FolderOpenDotIcon />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col">
        <h3 className="font-semibold text-sm truncate w-full mb-1 line-clamp-1">
          {project.name}
        </h3>

        <p className="text-xs text-muted-foreground">
          {timeAgo}
        </p>
      </div>
    </div>
  );
}
