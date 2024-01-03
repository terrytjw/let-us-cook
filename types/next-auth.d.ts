import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

/* This file is a TypeScript declaration file (*.d.ts). It is used to provide custom type definitions or to modify existing ones. In this case, it is extending the Session interface from the next-auth module.
The Session interface is being extended to include a user object with an id property of type string. This is in addition to the properties already defined in DefaultSession["user"] from next-auth.
This is useful when you want to add custom properties to existing types provided by a library, in this case next-auth, and ensure type safety and autocompletion in your TypeScript code. */
