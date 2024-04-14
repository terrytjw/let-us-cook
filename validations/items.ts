import * as z from "zod";

export const ItemPostSchema = z.object({
  userId: z.string(),
  name: z.string(),
  price: z.string(),
  description: z.string(),
});
