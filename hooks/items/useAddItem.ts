import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useToast } from "@/components/ui/use-toast";

export const useAddItemMutation = (userId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      const body = {
        userId,
        name: "Eggs",
        price: "2.99",
        description: "Fresh and low-fat Switzerland organic eggs.",
      };

      return axios.post("/api/items", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });

      toast({
        title: "Item added successfully",
        duration: 2000,
      });
    },
    onError: (error) => {
      console.error("Error adding item -> ", error);

      toast({
        title: "Something went wrong.",
        description: "Item was not added.",
        variant: "destructive",
      });
    },
  });

  return { addItem: mutate, isAddItemLoading: isPending };
};
