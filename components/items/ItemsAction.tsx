"use client";

import React from "react";
import { useAddItemMutation } from "@/hooks/items/useAddItem";

import { Button } from "../ui/button";

type ItemsActionProps = {
  userId: string;
};
const ItemsAction = ({ userId }: ItemsActionProps) => {
  const { addItem, isAddItemLoading } = useAddItemMutation(userId);

  return (
    <main className="py-4">
      <h1 className="py-4 text-xl">ItemsAction</h1>
      <Button
        onClick={() => addItem()}
        disabled={isAddItemLoading} // disable button during loading
        aria-label="Add an item" // accessibility label
      >
        {isAddItemLoading ? "Adding..." : "Add Item"}
      </Button>
    </main>
  );
};

export default ItemsAction;
