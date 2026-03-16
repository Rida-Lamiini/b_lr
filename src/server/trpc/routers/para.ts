import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const paraRouter = router({
  getAll: protectedProcedure
    .input(z.object({ 
      type: z.enum(["PROJECT", "AREA", "RESOURCE", "ARCHIVE"]).optional(),
      includeArchived: z.boolean().optional().default(false),
      skip: z.number().optional(),
      take: z.number().optional(),
      orderBy: z.enum(["updatedAt_desc", "updatedAt_asc", "name_asc", "name_desc"]).optional().default("updatedAt_desc"),
      filter: z.enum(["all", "withTasks", "noTasks", "active", "completed"]).optional().default("all"),
    }))
    .query(async ({ ctx, input }) => {
      const where: any = {
        userId: ctx.session.user.id,
        ...(input.type && { type: input.type }),
      };

      if (!input.includeArchived && input.type !== "ARCHIVE") {
        where.type = { not: "ARCHIVE" };
      }

      if (input.filter === "noTasks") {
        where.tasks = { none: {} };
      } else if (input.filter === "withTasks") {
        where.tasks = { some: {} };
      } else if (input.filter === "active") {
        where.tasks = { some: { completed: false } };
      } else if (input.filter === "completed") {
        where.tasks = { some: {}, every: { completed: true } };
      }

      const orderBy =
        input.orderBy === "name_asc" ? { name: "asc" } :
        input.orderBy === "name_desc" ? { name: "desc" } :
        input.orderBy === "updatedAt_asc" ? { updatedAt: "asc" } :
        { updatedAt: "desc" };

      const containers = await ctx.prisma.container.findMany({
        where,
        orderBy,
        skip: input.skip,
        take: input.take,
        include: {
          _count: {
            select: { tasks: true, notes: true }
          }
        }
      });

      if (!containers.length) {
        return containers;
      }

      const completedTasksByContainer = Object.fromEntries(
        (await ctx.prisma.task.groupBy({
          by: ["containerId"],
          where: {
            containerId: { in: containers.map((c) => c.id) },
            userId: ctx.session.user.id,
            completed: true,
          },
          _count: { _all: true },
        })).map((item) => [item.containerId, item._count._all])
      );

      return containers.map((container) => {
        const totalTasks = container._count?.tasks ?? 0;
        const completedTasks = completedTasksByContainer[container.id] ?? 0;
        const isComplete = totalTasks > 0 && completedTasks === totalTasks;

        return {
          ...container,
          completedTasks,
          isComplete,
        };
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.container.findUnique({
        where: { id: input.id, userId: ctx.session.user.id },
        include: { tasks: true, notes: true },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      type: z.enum(["PROJECT", "AREA", "RESOURCE", "ARCHIVE"]),
      description: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.container.create({
        data: {
          ...input,
          userId: ctx.session.user.id as string,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      type: z.enum(["PROJECT", "AREA", "RESOURCE", "ARCHIVE"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.container.update({
        where: { id, userId: ctx.session.user.id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.container.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
    
  moveToArchive: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.container.update({
        where: { id: input.id, userId: ctx.session.user.id },
        data: { type: "ARCHIVE" },
      });
    }),
});
