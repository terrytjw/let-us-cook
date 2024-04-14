"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Item from "./Item";
import { Icons } from "../Icons";

const ItemsList = () => {
  const fetchItems = async () => {
    const response = await axios.get(`/api/items`);

    return response.data.items;
  };
  const { data: items, isLoading: isItemsLoading } = useQuery<Item[]>({
    queryKey: ["items"],
    queryFn: fetchItems,
  });

  if (isItemsLoading) {
    return (
      <div className="mt-4 flex items-center gap-2">
        <Icons.loading className="h-4 w-4 animate-spin" /> Items Loading...
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="mt-4 tracking-wider text-gray-500">No items found</div>
    );
  }

  return (
    <main>
      <div className="grid grid-cols-1 gap-4 py-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item: Item) => (
          <Item key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
};

export default ItemsList;
