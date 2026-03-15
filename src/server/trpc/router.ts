import { router } from "./trpc";
import { healthRouter } from "./routers/health";
import { containerRouter } from "./routers/container";
import { taskRouter } from "./routers/task";
import { paraRouter } from "./routers/para";

import { timeblockRouter } from "./routers/timeblock";
import { journalRouter } from "./routers/journal";
import { milestoneRouter } from "./routers/milestone";
import { journeyRouter } from "./routers/journey";

export const appRouter = router({
  health: healthRouter,
  container: containerRouter,
  task: taskRouter,
  para: paraRouter,
  timeblock: timeblockRouter,
  journal: journalRouter,
  milestone: milestoneRouter,
  journey: journeyRouter,
});

export type AppRouter = typeof appRouter;