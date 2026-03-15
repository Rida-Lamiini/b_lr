import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const journeyRouter = router({
  getTimeline: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.session.user.id;

      const [journals, milestones, completedTasks] = await Promise.all([
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
      ]);

      // Combine and sort
      const timeline = [
        ...journals.map(j => ({ type: "journal" as const, id: j.id, date: j.date, title: j.title || "Untitled", content: j.content })),
        ...milestones.map(m => ({ type: "milestone" as const, id: m.id, date: m.date, title: m.title, content: m.description })),
        ...completedTasks.map(t => ({ type: "task" as const, id: t.id, date: t.updatedAt, title: t.title, content: t.description })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime());

      return timeline;
    }),
});
