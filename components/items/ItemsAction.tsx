"use client";

import React from "react";
import { useAddItemMutation } from "@/hooks/items/useAddItem";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";

type ItemsActionProps = {
  userId: string;
};
const ItemsAction = ({ userId }: ItemsActionProps) => {
  const { addItem, isAddItemLoading } = useAddItemMutation(userId);

  return (
    <main>
      <Button onClick={() => addItem()} disabled={isAddItemLoading}>
        {isAddItemLoading ? (
          <div className="flex items-center gap-2">
            {" "}
            <Icons.loading className="h-4 w-4 animate-spin" /> Adding...
          </div>
        ) : (
          "+ Add Item"
        )}
      </Button>
    </main>
  );
};

export default ItemsAction;
