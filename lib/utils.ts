import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

import { CoreMessage } from "ai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatMessage = (message: CoreMessage) => {
  return `${message.role}: ${message.content}`;
};

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string
