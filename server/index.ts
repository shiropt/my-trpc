import express from "express";
import { initTRPC, inferAsyncReturnType } from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import z from "zod";
import { PrismaClient } from "@prisma/client";
// type Context = inferAsyncReturnType;

const prisma = new PrismaClient();
const createContext = (opts: trpcExpress.CreateExpressContextOptions) => {
  return { prisma };
};
const app = express();
const PORT = 3000;
app.use(cors());
const trpc = initTRPC.context().create();

const appRouter = trpc.router({
  hello: trpc.procedure.query(() => {
    return "Hello World";
  }),
  helloName: trpc.procedure.input(z.object({ name: z.string(), age: z.number() })).query(({ input }) => {
    return {
      greeting: `Hello World ${input.name}`,
      age: input.age,
    };
  }),
  todos: trpc.procedure.query(async ({ ctx }: any) => {
    const todos = await ctx.prisma.todo.findMany();
    return todos;
  }),
});

app.get("/", (_req, res) => res.send("hello")); //削除可能

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));

export type AppRouter = typeof appRouter;
