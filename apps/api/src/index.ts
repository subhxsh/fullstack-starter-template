import { pool } from "@monorepo/shared/db";
import {
  getUserById,
  getUserByUsername,
  type SelectUser,
} from "@monorepo/shared/db/user";
import { envServer } from "@monorepo/shared/env";
import closeWithGrace from "close-with-grace";
import pgSimple from "connect-pg-simple";
import cors from "cors";
import express from "express";
import session from "express-session";
import helmet from "helmet";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { pinoHttp, startTime } from "pino-http";
import { errorMiddleware } from "./middlewares/error.ts";
import { logger } from "./utils/logger.ts";
import { comparePassword } from "./utils/scrypt.ts";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const app = express();

app.use(pinoHttp({ logger }));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: envServer.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new (pgSimple(session))({
      pool,
      createTableIfMissing: true,
    }),
    cookie: {
      // 30 days
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: envServer.NODE_ENV === "production",
      sameSite: true,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const user = await getUserByUsername(username);
    if (!user) return done(null, false);
    if (!(await comparePassword(password, user.password))) {
      done(null, false);
      return;
    }
    done(null, user);
  })
);

passport.serializeUser<{ id: string }>((user, done) => {
  done(null, { id: user.id });
});

passport.deserializeUser<{ id: string }>(async (data, done) => {
  try {
    const user = await getUserById(data.id);
    done(null, user ?? false);
  } catch (err) {
    done(err);
  }
});

app.get("/api/health", (_req, res) => {
  res.send({
    // TODO(subhxsh): Send 'degraded' based on response time and DB latency.
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: envServer.NODE_ENV,
    memoryUsage: process.memoryUsage(),
    responseTime: Date.now() - res[startTime],
  });
});

app.use(errorMiddleware);

const server = app.listen(envServer.PORT, envServer.HOST, (err) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
  logger.info(`started listening on port ${envServer.PORT}`);
});

closeWithGrace({ delay: 30_000, logger }, async ({ err }) => {
  if (err) logger.error(err);
  logger.info("shutting down gracefully");
  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  logger.info("shutdown successful");
});
