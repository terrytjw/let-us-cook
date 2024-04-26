import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useCreateNewThreadMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (message: string) => {
      const body = {
        message,
      };

      return axios.post("/api/assistants-api/threads", body);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["asst-threads"] });

      // TODO: hacky way of global state management, to be replaced with Zustand
      window.localStorage.setItem("is-new-asst-thread", "true");
      const { threadId } = response.data;
      router.push(`/ai/agent/${threadId}`);

      toast({
        title: "Thread created",
        duration: 2000,
      });
    },
    onError: (error: AxiosError) => {
      if (error.response) {
        const errorData = error.response.data as AxiosErrorResponse;
        console.error("Error creating thread -> ", errorData.error);

        toast({
          title: "Error creating new thread",
          description: errorData.error,
          variant: "destructive",
        });
      } else {
        console.error("Error creating thread -> ", error.message);

        toast({
          title: "Error creating new thread",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  return { createThread: mutate, isCreateThreadLoading: isPending };
};
