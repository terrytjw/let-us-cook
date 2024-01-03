import { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

export default {
  schema: "./lib/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  out: "./drizzle",
} satisfies Config;

/* All of the drizzle-kit commands use a drizzle.config.ts file in the root of the project. 
This file tells Drizzle Kit where to find the schema files, what database driver to use, 
and where to output the generated files. */
