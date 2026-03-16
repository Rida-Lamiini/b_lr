import { router, protectedProcedure } from "../trpc";

export const graphRouter = router({
  getGraphData: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // Fetch all entities
    const containers = await ctx.prisma.container.findMany({
      where: { userId },
      select: { id: true, name: true, type: true },
    });

    const tasks = await ctx.prisma.task.findMany({
      where: { userId, completed: false }, // only show active tasks? Or all? Let's show all for a full brain map, or maybe just active to keep it clean. Let's do active for now.
      select: { id: true, title: true, containerId: true },
    });

    const notes = await ctx.prisma.note.findMany({
      where: { userId },
      select: { id: true, title: true, containerId: true },
    });

    const nodes: any[] = [];
    const links: any[] = [];

    // Add Container Nodes
    containers.forEach((c) => {
      nodes.push({
        id: c.id,
        name: c.name,
        group: c.type, // 'AREA', 'PROJECT', etc.
        val: c.type === "AREA" ? 20 : 15,
      });

      // If we wanted, we could link Projects to Areas (needs schema support, currently containers are flat or we use logic. We skip inter-container links for now unless implied).
    });

    // Add Task Nodes & Links
    tasks.forEach((t) => {
      nodes.push({
        id: t.id,
        name: t.title,
        group: "TASK",
        val: 5,
      });

      if (t.containerId) {
        links.push({
          source: t.id,
          target: t.containerId,
        });
      }
    });

    // Add Note Nodes & Links
    notes.forEach((n) => {
      nodes.push({
        id: n.id,
        name: n.title,
        group: "NOTE",
        val: 8,
      });

      if (n.containerId) {
        links.push({
          source: n.id,
          target: n.containerId,
        });
      }
    });

    return { nodes, links };
  }),
});
