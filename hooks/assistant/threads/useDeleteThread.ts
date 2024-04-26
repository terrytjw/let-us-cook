import { useRouter } from "next/navigation";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export const useDeleteThreadMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (threadId: string) => {
      return axios.delete(`/api/assistants-api/threads/${threadId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asst-threads"] });

      router.push(`/ai/agent`);

      toast({
        title: "Thread deleted successfully",
      });
    },
    onError: (error) => {
      console.error("Error deleting thread -> ", error);

      toast({
        title: "Failed to delete thread",
        description: "The thread could not be deleted. Please try again.",
        variant: "destructive",
      });
    },
  });

  return { deleteThread: mutate, isDeleteThreadLoading: isPending };
};
