import { useMutation, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner";


export const useCreateProject = () => {
     const router = useRouter();
     return useMutation({
          mutationFn: async ({ prompt }: { prompt: string }) => {
               const response = await axios.post("/api/project", {
                    prompt,
               })
               return response.data
          },
          onSuccess: (data) => {
               router.push(`/project/${data.data.id}`)
          },
          onError: (error) => {
               console.log("Failed TO create an project", error);
               toast.error("Failed TO create an project")
          },
     })

}


// for fetching the data from db or server
export const useGetProject = (userId: string) => {
     return useQuery({
          queryKey: ["projects"],
          queryFn: async () => {
               const result = await axios.get("/api/project");
               return result.data.data
          },
          enabled: !!userId
     })
}