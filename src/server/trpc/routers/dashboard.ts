import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { startOfDay, endOfDay, subMonths, format } from "date-fns";

export const dashboardRouter = router({
  getActivityHeatmap: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const sixMonthsAgo = subMonths(startOfDay(new Date()), 6);

    const completedTasks = await ctx.prisma.task.findMany({
      where: {
        userId,
        completed: true,
        updatedAt: { gte: sixMonthsAgo },
      },
      select: { updatedAt: true },
    });

    // Group by date string
    const counts = new Map<string, number>();
    for (const t of completedTasks) {
      const key = format(t.updatedAt, "yyyy-MM-dd");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }

    return Array.from(counts.entries()).map(([date, value]) => ({
      date,
      value,
    }));
  }),

  getPartitionData: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user?.id;
    if (!userId) throw new Error("Unauthorized");

    const containers = await ctx.prisma.container.findMany({
      where: { userId },
      include: {
        _count: { select: { tasks: true, notes: true } },
      },
      orderBy: { updatedAt: "desc" },
    });

    return containers.map((c) => ({
      id: c.id,
      label: c.name,
      value: c._count.tasks + c._count.notes,
      group: c.type,
      sub: `${c._count.tasks} tasks · ${c._count.notes} notes`,
    }));
  }),
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
