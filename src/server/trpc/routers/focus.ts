import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { startOfDay, endOfDay } from "date-fns";

export const focusRouter = router({
  startSession: protectedProcedure
    .mutation(async ({ ctx }) => {
      // Create a fresh session with a start time
      return ctx.prisma.focusSession.create({
        data: {
          start: new Date(),
          userId: ctx.session.user.id as string,
        },
      });
    }),

  endSession: protectedProcedure
    .input(z.object({
      id: z.string(),
      durationSecs: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      // Complete the session and record its valid focused duration
      return ctx.prisma.focusSession.update({
        where: { 
          id: input.id,
          userId: ctx.session.user.id,
        },
        data: {
          end: new Date(),
          duration: input.durationSecs,
        },
      });
    }),

  getDailyStats: protectedProcedure
    .query(async ({ ctx }) => {
      const today = new Date();
      const start = startOfDay(today);
      const end = endOfDay(today);

      const sessions = await ctx.prisma.focusSession.findMany({
        where: {
          userId: ctx.session.user.id,
          start: { gte: start, lte: end },
          end: { not: null }, // Only count completed sessions
        },
      });

      const totalDurationSecs = sessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
      
      return {
        totalDurationSecs,
        sessionCount: sessions.length,
      };
    }),

  getHistory: protectedProcedure
    .input(z.object({
      take: z.number().default(10),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.focusSession.findMany({
        where: {
          userId: ctx.session.user.id,
          end: { not: null },
        },
        orderBy: { start: 'desc' },
        take: input.take,
      });
    }),
});
