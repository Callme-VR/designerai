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
      className="w-full flex flex-col rounded-xl cursor-pointer border border-border/50 bg-card hover:shadow-lg hover:border-border transition-all duration-200 overflow-hidden group"
      onClick={onRoute}
    >
      <div className="h-40 bg-muted/50 relative overflow-hidden flex items-center justify-center">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={project.name}
            className="w-full h-full object-cover object-left group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-16 h-16 bg-primary/10 group-hover:scale-110 transition-all duration-300 rounded-full flex items-center justify-center">
            <FolderOpenDotIcon className="size-8 text-primary" />
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-1">
        <h3 className="font-semibold text-sm truncate w-full line-clamp-1">
          {project.name}
        </h3>

        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </div>
  );
}
