import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const milestoneRouter = router({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.milestone.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { date: "desc" },
      });
    }),

  upsert: protectedProcedure
    .input(z.object({
      id: z.string().optional(),
      title: z.string(),
      description: z.string().optional().nullable(),
      date: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      if (id) {
        return ctx.prisma.milestone.update({
          where: { id, userId: ctx.session.user.id },
          data,
        });
      }
      return ctx.prisma.milestone.create({
        data: {
          ...data,
          userId: ctx.session.user.id as string,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.milestone.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
});
