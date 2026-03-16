import { router, protectedProcedure } from "../trpc";
import { z } from "zod";

export const searchRouter = router({
  query: protectedProcedure
    .input(z.object({
      text: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      if (!input.text || input.text.trim().length < 2) return [];

      // FTS5 Search Query
      // Using raw SQL to interact with the virtual table
      const results = await ctx.prisma.$queryRaw<{
        id: string;
        type: 'note' | 'task' | 'journal' | 'milestone';
        title: string;
        content: string;
        snippet: string;
      }[]>`
        SELECT 
          id, 
          type, 
          title, 
          content,
          snippet(SearchIndex, 3, '<b>', '</b>', '...', 15) as snippet
        FROM SearchIndex 
        WHERE SearchIndex MATCH ${input.text + "*"} 
          AND userId = ${userId}
        ORDER BY rank
        LIMIT 20;
      `;

      return results;
    }),
});
