import { router } from "./trpc";
import { healthRouter } from "./routers/health";
import { containerRouter } from "./routers/container";
import { taskRouter } from "./routers/task";
import { paraRouter } from "./routers/para";

export const appRouter = router({
  health: healthRouter,
  container: containerRouter,
  task: taskRouter,
  para: paraRouter,
});

export type AppRouter = typeof appRouter;