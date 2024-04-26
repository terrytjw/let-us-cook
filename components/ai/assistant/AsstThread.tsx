"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type AsstThreadProps = {
  thread: AsstThread;
};
const AsstThread = ({ thread }: AsstThreadProps) => {
  const { id, title, createdAt } = thread;

  return (
    <Link
      href={`/ai/agent/${id}`}
      className="group flex-col justify-between rounded-lg border bg-background/50 p-4 transition-all duration-500 hover:-translate-y-2 hover:text-primary hover:shadow-lg hover:shadow-primary/50"
    >
      <h2 className="text-lg font-medium">{title}</h2>
      <p className="text-gray-500">{id}</p>
      <p className="text-gray-500">
        {formatDistanceToNow(new Date(createdAt), {
          addSuffix: true,
        })}
      </p>
    </Link>
  );
};

export default AsstThread;
