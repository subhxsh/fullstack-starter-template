import type {
  Request as ExpressRequest,
  Response as ExpressResponse,
  NextFunction,
} from "express";
import { HttpError } from "../errors/http.ts";

export function errorMiddleware(
  error: unknown,
  req: ExpressRequest,
  res: ExpressResponse,
  _next: NextFunction
) {
  req.log.error(error);
  if (res.headersSent) {
    req.log.info("headers already sent, could not send error response");
    return;
  }
  if (error instanceof HttpError) {
    res.status(error.status).json(error.body);
    return;
  }
  res.status(500).json({
    message: "Internal server error",
  });
}
