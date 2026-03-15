import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const taskRouter = router({
  getAll: protectedProcedure
    .input(z.object({ containerId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.task.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input.containerId && { containerId: input.containerId }),
        },
        orderBy: [{ completed: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
      });
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      priority: z.number().int().min(1).max(5).optional(),
      containerId: z.string().optional(),
      dueDate: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.task.create({
        data: {
          ...input,
          userId: ctx.session.user.id as string,
        },
      });
    }),

  toggle: protectedProcedure
    .input(z.object({ id: z.string(), completed: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.task.update({
        where: { id: input.id, userId: ctx.session.user.id },
        data: { completed: input.completed },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      priority: z.number().int().min(1).max(5).optional(),
      completed: z.boolean().optional(),
      containerId: z.string().optional(),
      dueDate: z.date().nullable().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      return ctx.prisma.task.update({
        where: { id, userId: ctx.session.user.id },
        data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.task.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
});
