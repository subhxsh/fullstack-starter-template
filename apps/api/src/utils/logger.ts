import { pino } from "pino";
import { envServer } from "./env.ts";

export const logger = pino({
  level: envServer.LOG_LEVEL,
  timestamp: pino.stdTimeFunctions.isoTime,
});
