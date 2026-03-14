/**
 * Lightweight Server Logger
 * Provides structured logging for API request lifecycle.
 * Uses console-based output compatible with Vercel/Next.js runtime.
 */

const LOG_LEVELS = {
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  DEBUG: "DEBUG",
};

function formatTimestamp() {
  return new Date().toISOString();
}

function formatLog(level, context, message, meta = {}) {
  const base = {
    timestamp: formatTimestamp(),
    level,
    context,
    message,
  };
  if (Object.keys(meta).length > 0) base.meta = meta;
  return base;
}

export const logger = {
  info(context, message, meta = {}) {
    console.log(JSON.stringify(formatLog(LOG_LEVELS.INFO, context, message, meta)));
  },

  warn(context, message, meta = {}) {
    console.warn(JSON.stringify(formatLog(LOG_LEVELS.WARN, context, message, meta)));
  },

  error(context, message, meta = {}) {
    console.error(JSON.stringify(formatLog(LOG_LEVELS.ERROR, context, message, meta)));
  },

  debug(context, message, meta = {}) {
    if (process.env.NODE_ENV === "development") {
      console.debug(JSON.stringify(formatLog(LOG_LEVELS.DEBUG, context, message, meta)));
    }
  },

  /** Log an API request lifecycle event */
  apiRequest(method, path, meta = {}) {
    this.info("API", `${method} ${path}`, meta);
  },

  /** Log a successful API response */
  apiSuccess(method, path, meta = {}) {
    this.info("API", `${method} ${path} → OK`, meta);
  },

  /** Log a failed API response */
  apiError(method, path, error, meta = {}) {
    this.error("API", `${method} ${path} → FAILED`, {
      ...meta,
      error: error instanceof Error ? error.message : String(error),
    });
  },
};
