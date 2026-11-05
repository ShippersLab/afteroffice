import type { ErrorHandler, NotFoundHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { AppEnv } from "../configuration/env";
import { errorResponse } from "../utilities/http";

export const onError: ErrorHandler<AppEnv> = (error, c) => {
  if (error instanceof HTTPException && error.status < 500) {
    return errorResponse(c, 400, "invalid_request");
  }
  return errorResponse(c, 500, "internal_error");
};

export const onNotFound: NotFoundHandler<AppEnv> = (c) => errorResponse(c, 404, "not_found");
