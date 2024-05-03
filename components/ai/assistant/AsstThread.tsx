"use client";

import React from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { Skeleton } from "@/components/ui/skeleton";

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

AsstThread.Skeleton = function AsstThreadSkeleton() {
  return (
    <div className="flex flex-col gap-y-2 rounded-md border border-gray-200 p-4 shadow-sm">
      <Skeleton className="h-5 w-1/2 text-gray-500" />
      <Skeleton className="h-5 w-1/2 text-gray-500" />
      <div className="mt-4 flex justify-end">
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  );
};
