import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { startOfDay, endOfDay } from "date-fns";

export const dashboardRouter = router({
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const today = startOfDay(new Date());
    const tomorrow = endOfDay(new Date());

    // 1. PARA Stats
    const containerCounts = await ctx.prisma.container.groupBy({
      by: ["type"],
      where: { userId },
      _count: { _all: true },
    });

    const getCount = (type: string) => 
      containerCounts.find(c => c.type === type)?._count._all || 0;

    // 2. Task Stats
    const [pendingTasks, completedToday] = await Promise.all([
      ctx.prisma.task.count({
        where: { userId, completed: false },
      }),
      ctx.prisma.task.count({
        where: { 
          userId, 
          completed: true,
          updatedAt: {
            gte: today,
            lte: tomorrow,
          }
        },
      }),
    ]);

    // 3. Habit Stats
    const habits = await ctx.prisma.habit.findMany({
      where: { userId, active: true },
      include: {
        logs: {
          where: { completed: true },
          orderBy: { date: "desc" },
        }
      }
    });

    // Simple streak calculation for dashboard overview
    const activeHabitsCount = habits.length;
    
    // 4. Notes Stats
    const totalNotes = await ctx.prisma.note.count({
      where: { userId },
    });

    return {
      para: {
        projects: getCount("PROJECT"),
        areas: getCount("AREA"),
        resources: getCount("RESOURCE"),
        archive: getCount("ARCHIVE"),
      },
      tasks: {
        pending: pendingTasks,
        completedToday: completedToday,
      },
      habits: {
        activeCount: activeHabitsCount,
      },
      notes: {
        total: totalNotes,
      }
    };
  }),
});
