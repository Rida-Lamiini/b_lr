import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { startOfDay } from "date-fns";

export const dailyLogRouter = router({
  getByDate: protectedProcedure
    .input(z.object({ date: z.date() }))
    .query(async ({ ctx, input }) => {
      const date = startOfDay(input.date);
      const userId = ctx.session.user.id as string;
      return ctx.prisma.dailyLog.findUnique({
        where: {
          userId_date: {
            userId,
            date,
          },
        },
      });
    }),

  upsert: protectedProcedure
    .input(
      z.object({
        date: z.date(),
        mood: z.number().min(1).max(5).optional().nullable(),
        energy: z.number().min(1).max(5).optional().nullable(),
        sleep: z.number().min(0).max(24).optional().nullable(),
        content: z.string().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { date, ...data } = input;
      const normalizedDate = startOfDay(date);
      const userId = ctx.session.user.id as string;

      // Clean data for Prisma (replace null/undefined with undefined or null as needed)
      const prismaData = {
        mood: data.mood ?? undefined,
        energy: data.energy ?? undefined,
        sleep: data.sleep ?? undefined,
        content: data.content ?? undefined,
      };

      return ctx.prisma.dailyLog.upsert({
        where: {
          userId_date: {
            userId,
            date: normalizedDate,
          },
        },
        create: {
          ...prismaData,
          date: normalizedDate,
          userId,
        },
        update: prismaData,
      });
    }),

  getStats: protectedProcedure
    .input(z.object({ days: z.number().default(7) }))
    .query(async ({ ctx, input }) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      return ctx.prisma.dailyLog.findMany({
        where: {
          userId: ctx.session.user.id,
          date: { gte: startOfDay(startDate) },
        },
        orderBy: { date: "asc" },
      });
    }),
});
