import * as z from "zod";

const result = z
  .object({
    HOST: z.string().ip({ version: "v4" }).optional().default("0.0.0.0"),
    PORT: z.coerce.number().optional().default(5000),

    NODE_ENV: z
      .enum(["development", "staging", "production"])
      .optional()
      .default("development"),

    SESSION_SECRET: z.string(),

    LOG_LEVEL: z
      .enum(["debug", "error", "fatal", "info", "silent", "trace", "warn"])
      .optional()
      .default("info"),
  })
  .safeParse(process.env);

if (!result.success) {
  throw new Error("Invalid environment variables", {
    cause: result.error.flatten().fieldErrors,
  });
}

export const envServer = result.data;
