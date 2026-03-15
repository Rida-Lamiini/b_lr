import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const containerRouter = router({
  getAll: protectedProcedure
    .input(z.object({ type: z.enum(["PROJECT", "AREA", "RESOURCE", "ARCHIVE"]).optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.container.findMany({
        where: {
          userId: ctx.session.user.id,
          ...(input.type && { type: input.type }),
        },
        orderBy: { updatedAt: "desc" },
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
});
