"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import Item from "./Item";

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
    return <div>Loading...</div>;
  }

  if (!items) {
    return <div>No items found</div>;
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
