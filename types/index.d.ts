// index.d.ts file is used to declare types for the entire project and is automatically included by the TypeScript compiler
// TypeScript linting tools use type declaration files like index.d.ts to enforce type correctness throughout the codebase
import { CoreMessage } from "ai";

type Item = {
  id: string;
  userId: string;
  name: string;
  price: number;
  description: string;
};

type AsstThread = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
};

type AxiosErrorResponse = {
  error: string;
};

type Message = CoreMessage & {
  id: string;
};
