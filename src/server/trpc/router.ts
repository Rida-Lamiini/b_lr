import { router } from "./trpc";
import { healthRouter } from "./routers/health";
import { containerRouter } from "./routers/container";
import { taskRouter } from "./routers/task";
import { paraRouter } from "./routers/para";

import { timeblockRouter } from "./routers/timeblock";
import { journalRouter } from "./routers/journal";
import { milestoneRouter } from "./routers/milestone";
import { journeyRouter } from "./routers/journey";
import { noteRouter } from "./routers/note";
import { fileRouter } from "./routers/file";
import { dailyLogRouter } from "./routers/dailyLog";

import { habitRouter } from "./routers/habit";

import { searchRouter } from "./routers/search";
import { dashboardRouter } from "./routers/dashboard";

export const appRouter = router({
  health: healthRouter,
  container: containerRouter,
  task: taskRouter,
  para: paraRouter,
  timeblock: timeblockRouter,
  journal: journalRouter,
  milestone: milestoneRouter,
  journey: journeyRouter,
  note: noteRouter,
  file: fileRouter,
  dailyLog: dailyLogRouter,
  habit: habitRouter,
  search: searchRouter,
  dashboard: dashboardRouter,
});

export type AppRouter = typeof appRouter;