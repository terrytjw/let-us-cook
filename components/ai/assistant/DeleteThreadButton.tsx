"use client";

import React from "react";
import { useDeleteThreadMutation } from "@/hooks/assistant/threads/useDeleteThread";

import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";

type DeleteThreadButtonProps = {
  threadId: string;
};
const DeleteThreadButton = ({ threadId }: DeleteThreadButtonProps) => {
  const { deleteThread, isDeleteThreadLoading } = useDeleteThreadMutation();
  return (
    <Button
      variant="destructive"
      onClick={() => deleteThread(threadId)}
      disabled={isDeleteThreadLoading}
    >
      {isDeleteThreadLoading ? (
        <div className="flex items-center gap-2">
          {" "}
          <Icons.loading className="h-4 w-4 animate-spin" /> Deleting...
        </div>
      ) : (
        "Delete Thread"
      )}
    </Button>
  );
};

export default DeleteThreadButton;
