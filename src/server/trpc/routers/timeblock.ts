import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const timeblockRouter = router({
  getAll: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      const startOfDay = new Date(input.date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(input.date);
      endOfDay.setHours(23, 59, 59, 999);

      return ctx.prisma.timeblock.findMany({
        where: {
          userId: ctx.session.user.id,
          start: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          task: true,
        },
        orderBy: {
          start: "asc",
        },
      });
    }),

  upsert: protectedProcedure
    .input(z.object({
      id: z.string().optional(),
      title: z.string(),
      start: z.date(),
      end: z.date(),
      taskId: z.string().optional().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      
      if (id) {
        return ctx.prisma.timeblock.update({
          where: { id, userId: ctx.session.user.id },
          data,
        });
      }

      return ctx.prisma.timeblock.create({
        data: {
          ...data,
          userId: ctx.session.user.id as string,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.timeblock.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
});
