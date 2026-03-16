import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { startOfWeek } from "date-fns";

export const weeklyReviewRouter = router({
  getByWeek: protectedProcedure
    .input(z.object({
      weekStart: z.date(),
    }))
    .query(async ({ ctx, input }) => {
      // Ensure we're querying exact start of week
      const weekStart = startOfWeek(input.weekStart, { weekStartsOn: 1 });

      const review = await ctx.prisma.weeklyReview.findFirst({
        where: {
          userId: ctx.session.user.id,
          weekStart: weekStart,
        },
      });

      return review;
    }),

  upsert: protectedProcedure
    .input(z.object({
      weekStart: z.date(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const weekStart = startOfWeek(input.weekStart, { weekStartsOn: 1 });

      // Find existing
      const existing = await ctx.prisma.weeklyReview.findFirst({
        where: {
          userId: ctx.session.user.id,
          weekStart: weekStart,
        },
      });

      if (existing) {
        return ctx.prisma.weeklyReview.update({
          where: { id: existing.id },
          data: { content: input.content },
        });
      }

      return ctx.prisma.weeklyReview.create({
        data: {
          userId: ctx.session.user.id as string,
          weekStart: weekStart,
          content: input.content,
        },
      });
    }),
});
