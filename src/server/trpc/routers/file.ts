import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import fs from "fs/promises";
import path from "path";

export const fileRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.file.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const file = await ctx.prisma.file.findUnique({
        where: { id: input.id, userId: ctx.session.user.id },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      // Delete from DB first
      await ctx.prisma.file.delete({
        where: { id: input.id },
      });

      // Try to delete physical file
      try {
        const absolutePath = path.join(process.cwd(), "public", file.path);
        await fs.unlink(absolutePath);
      } catch (error) {
        console.error("[TRPC] Failed to delete physical file:", error);
        // We don't throw here to ensure the DB state remains consistent
      }

      return { success: true };
    }),

  linkToEntity: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
        entityType: z.enum(["task", "note"]),
        entityId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { fileId, entityType, entityId } = input;

      const file = await ctx.prisma.file.findUnique({
        where: { id: fileId, userId: ctx.session.user.id },
      });

      if (!file) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "File not found",
        });
      }

      if (entityType === "task") {
        return ctx.prisma.file.update({
          where: { id: fileId },
          data: { taskId: entityId },
        });
      } else {
        return ctx.prisma.file.update({
          where: { id: fileId },
          data: { noteId: entityId },
        });
      }
    }),
});
