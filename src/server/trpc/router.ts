import { router } from "./trpc";
import { healthRouter } from "./routers/health";
import { containerRouter } from "./routers/container";
import { taskRouter } from "./routers/task";

export const appRouter = router({
  health: healthRouter,
  container: containerRouter,
  task: taskRouter,
});

export type AppRouter = typeof appRouter;