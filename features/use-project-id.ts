import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

export const useGetProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const res = await axios.get(`/api/project/${projectId}`);
      return res.data;
    },
    enabled: !!projectId,
  });
};

export const useGenrateDesignById = (projectId: String) => {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const res = await axios.post(`/api/project/${projectId}`, { prompt });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Design generated successfully");
    },
    onError: () => {
      toast.error("Failed to generate design");
    },
  });
};

export const useUpdateProject = (projectId: String) => {
  return useMutation({
    mutationFn: async ({ themeId }: { themeId: string }) => {
      const res = await axios.patch(`/api/project/${projectId}`, { themeId });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Project updated successfully");
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });
};
