import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const journeyRouter = router({
  getTimeline: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const [journals, milestones, completedTasks, dailyLogs] = await Promise.all([
        ctx.prisma.journalEntry.findMany({
          where: { userId },
          orderBy: { date: "desc" },
        }),
        ctx.prisma.milestone.findMany({
          where: { userId },
          orderBy: { date: "desc" },
        }),
        ctx.prisma.task.findMany({
          where: { userId, completed: true },
          orderBy: { updatedAt: "desc" },
          take: 50,
        }),
        ctx.prisma.dailyLog.findMany({
          where: { userId },
          orderBy: { date: "desc" },
          take: 30,
        }),
      ]);

      // Combine and sort
      const timeline = [
        ...journals.map((j: { id: string; date: Date; title: string | null; content: string }) => ({ type: "journal" as const, id: j.id, date: j.date, title: j.title || "Untitled", content: j.content })),
        ...milestones.map((m: { id: string; date: Date; title: string; description: string | null }) => ({ type: "milestone" as const, id: m.id, date: m.date, title: m.title, content: m.description })),
        ...completedTasks.map((t: { id: string; updatedAt: Date; title: string; description: string | null }) => ({ type: "task" as const, id: t.id, date: t.updatedAt, title: t.title, content: t.description })),
        ...dailyLogs.map((d: { id: string; date: Date; mood: number | null; energy: number | null; content: string | null }) => ({ 
          type: "dailyLog" as const, 
          id: d.id, 
          date: d.date, 
          title: `Daily Status: ${d.mood ? "Mood (" + d.mood + "/5)" : "Logged"}`,
          content: d.content || (d.energy ? `Energy level: ${d.energy}/5` : "Daily metrics updated.")
        })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime());

      return timeline;
    }),
});
