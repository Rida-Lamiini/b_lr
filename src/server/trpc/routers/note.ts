import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const noteRouter = router({
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      return ctx.prisma.note.findMany({
        where: { userId: ctx.session.user.id },
        orderBy: { updatedAt: "desc" },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.note.findUnique({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),

  upsert: protectedProcedure
    .input(z.object({
      id: z.string().optional(),
      title: z.string(),
      content: z.string(),
      containerId: z.string().optional().nullable(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const userId = ctx.session.user.id;

      if (!userId) {
        console.error("[TRPC] note.upsert: userId is missing from session");
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID missing from session. Please relog.",
        });
      }

      try {
        if (id) {
          console.log(`[TRPC] Updating note ${id} for user ${userId}`);
          return await ctx.prisma.note.update({
            where: { id, userId },
            data,
          });
        }
        
        console.log(`[TRPC] Creating new note for user ${userId}`);
        return await ctx.prisma.note.create({
          data: {
            ...data,
            userId,
          },
        });
      } catch (error) {
        console.error("[TRPC] note.upsert transition failed:", error);
        throw error;
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.note.delete({
        where: { id: input.id, userId: ctx.session.user.id },
      });
    }),
});
