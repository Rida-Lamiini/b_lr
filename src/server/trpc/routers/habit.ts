import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { startOfDay, subDays, isSameDay } from "date-fns";

export const habitRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const habits = await ctx.prisma.habit.findMany({
      where: { userId },
      include: {
        logs: {
          orderBy: { date: "desc" },
        },
      },
    });

    return habits.map((habit) => {
      // Calculate streaks
      const sortedLogs = [...habit.logs].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      const today = startOfDay(new Date());
      let lastDate: Date | null = null;

      // Simple current streak calculation
      let checkDate = today;
      let logIndex = 0;

      // Current Streak
      while (logIndex < sortedLogs.length) {
        const log = sortedLogs[logIndex];
        const logDate = startOfDay(new Date(log.date));

        if (isSameDay(logDate, checkDate)) {
          if (log.completed) {
            currentStreak++;
            checkDate = subDays(checkDate, 1);
            logIndex++;
          } else {
            break;
          }
        } else if (logDate < checkDate) {
          // If we missed today, streak might still be active if yesterday was completed
          if (isSameDay(checkDate, today)) {
            checkDate = subDays(checkDate, 1);
            continue;
          }
          break;
        } else {
          logIndex++;
        }
      }

      // Longest Streak
      let currentSeq = 0;
      let prevDirDate: Date | null = null;

      const continuousLogs = sortedLogs
        .filter((l) => l.completed)
        .sort((a, b) => a.date.getTime() - b.date.getTime());

      for (const log of continuousLogs) {
        const d = startOfDay(new Date(log.date));
        if (prevDirDate && isSameDay(d, subDays(prevDirDate, -1))) {
          currentSeq++;
        } else {
          currentSeq = 1;
        }
        longestStreak = Math.max(longestStreak, currentSeq);
        prevDirDate = d;
      }

      const completedToday = habit.logs.some(
        (l) => isSameDay(startOfDay(new Date(l.date)), today) && l.completed
      );

      return {
        ...habit,
        currentStreak,
        longestStreak,
        completedToday,
      };
    });
  }),

  upsert: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        title: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
        color: z.string().optional(),
        frequency: z.string().default("DAILY"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { id, ...data } = input;

      if (id) {
        return ctx.prisma.habit.update({
          where: { id, userId },
          data,
        });
      }

      return ctx.prisma.habit.create({
        data: {
          ...data,
          userId,
        },
      });
    }),

  toggleLog: protectedProcedure
    .input(
      z.object({
        habitId: z.string(),
        date: z.date(),
        completed: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { habitId, date, completed } = input;
      const d = startOfDay(date);

      return ctx.prisma.habitLog.upsert({
        where: {
          userId_habitId_date: {
            userId,
            habitId,
            date: d,
          },
        },
        create: {
          userId,
          habitId,
          date: d,
          completed,
        },
        update: {
          completed,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.prisma.habit.delete({
        where: { id: input, userId },
      });
    }),
});
