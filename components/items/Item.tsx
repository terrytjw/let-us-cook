"use client";

import React from "react";
import { useDeleteItemMutation } from "@/hooks/items/useDeleteItem";

import { Button } from "../ui/button";
import { Icons } from "../Icons";

type ItemProps = {
  item: Item;
};
const Item = ({ item }: ItemProps) => {
  const { name, price, description } = item;

  const { deleteItem, isDeleteItemLoading } = useDeleteItemMutation();

  return (
    <div className="rounded-md border border-gray-200 p-4 shadow-sm">
      <h2 className="text-lg font-medium">{name}</h2>
      <p className="text-gray-500">Price: ${price}</p>
      <p className="text-gray-500">{description}</p>
      <div className="mt-4 flex justify-end">
        <Button
          variant="destructive"
          onClick={() => deleteItem(item.id)}
          disabled={isDeleteItemLoading}
        >
          {isDeleteItemLoading ? (
            <div className="flex items-center gap-2">
              {" "}
              <Icons.loading className="h-4 w-4 animate-spin" /> Deleting...
            </div>
          ) : (
            "Delete"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Item;
