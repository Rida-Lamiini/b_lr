import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const journalRouter = router({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.journalEntry.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { date: "desc" },
      });
    }),

  upsert: protectedProcedure
    .input(z.object({
      id: z.string().optional(),
      title: z.string().optional().nullable(),
      content: z.string(),
      date: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        return ctx.prisma.journalEntry.update({
          where: { id, userId: ctx.session.user.id },
          data,
        });
      }
      return ctx.prisma.journalEntry.create({
        data: {
          ...data,
          userId: ctx.session.user.id as string,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.journalEntry.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
});
