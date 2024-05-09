"use client";

import React from "react";
import { motion } from "framer-motion";

import { Icons } from "@/components/Icons";

// TODO(code-gen): ensure this component is only rendered once
// currently, the component is re-rendered multiple times at once which causes a visual bug of the path being animated twice
type ToolCallCompleteProps = {
  message: string;
};
const ToolCallComplete = ({ message }: ToolCallCompleteProps) => {
  return (
    <div className="flex items-center gap-2">
      {/* <motion.span initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}>
        <Icons.check size={18} />
      </motion.span> */}
      <svg
        className="h-4 w-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
      >
        <motion.path
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ToolCallComplete;
