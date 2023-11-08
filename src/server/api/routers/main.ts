import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import {
  boards,
  insertBoardSchema,
  insertTaskSchema,
  tasks,
} from "@/server/db/schema";
import { asc, eq } from "drizzle-orm";

export const mainRouter = createTRPCRouter({
  createTask: publicProcedure
    .input(insertTaskSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(tasks).values({
        title: input.title,
        status: "todo",
        boardId: input.boardId,
      });
    }),
  createBoard: publicProcedure
    .input(insertBoardSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(boards).values({
        title: input.title,
      });
    }),
  removeBoard: publicProcedure
    .input(insertBoardSchema.pick({ id: true }).required())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(boards).where(eq(boards.id, input.id));
    }),
  getAllBoards: publicProcedure.query(({ ctx }) => {
    return ctx.db.select().from(boards).orderBy(asc(boards.title));
  }),
  getAllTasks: publicProcedure
    .input(insertBoardSchema.pick({ id: true }).required())
    .query(({ input, ctx }) => {
      return ctx.db
        .select()
        .from(tasks)
        .where(eq(boards.id, input.id))
        .orderBy(asc(tasks.title));
    }),
  updateStatus: publicProcedure
    .input(insertTaskSchema.pick({ id: true, status: true }).required())
    .mutation(async ({ input, ctx }) => {
      await ctx.db
        .update(tasks)
        .set({
          status: input.status,
        })
        .where(eq(tasks.id, input.id));
    }),
});
