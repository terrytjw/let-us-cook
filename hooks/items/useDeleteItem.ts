import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useDeleteItemMutation = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (itemId: string) => {
      return axios.delete(`/api/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });

      toast({
        title: "Item deleted",
      });
    },
    onError: (error) => {
      console.error("Error deleting item -> ", error);

      toast({
        title: "Something went wrong.",
        description: "Your item was not deleted. Please try again.",
        variant: "destructive",
      });
    },
  });

  return { deleteItem: mutate, isDeleteItemLoading: isPending };
};
