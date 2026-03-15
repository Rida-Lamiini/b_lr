import { router } from "./trpc";
import { healthRouter } from "./routers/health";
import { containerRouter } from "./routers/container";
import { taskRouter } from "./routers/task";
import { paraRouter } from "./routers/para";

import { timeblockRouter } from "./routers/timeblock";

export const appRouter = router({
  health: healthRouter,
  container: containerRouter,
  task: taskRouter,
  para: paraRouter,
  timeblock: timeblockRouter,
});

export type AppRouter = typeof appRouter;