import { envServer } from "@monorepo/shared/env";
import { pino } from "pino";

export const logger = pino({
  level: envServer.LOG_LEVEL,
  timestamp: pino.stdTimeFunctions.isoTime,
});
