import { CookieOptions } from "express-serve-static-core";
import { CorsOptions } from "cors";
import { Store } from "express-session";
import { Authenticator } from "passport";
import { PandaGraphQL } from "./panda-graphql";

/**
 * Session options.
 */
interface SessionOptions {
  secret?: string;
  cookie?: CookieOptions;
}

/**
 * Express options.
 */
interface ExpressOptions {
  port?: string | number;
  cors?: CorsOptions;
  session?: SessionOptions;
}

/**
 * Panda Express Settings.
 */
export interface PandaExpressSettings {
  express?: ExpressOptions;
}

/**
 * Type for express middlewares. Path is optional.
 */
export interface ExpressMiddleware {
  path?: string;
  function: Function;
}

/**
 * Panda Express initialisation options.
 */
export interface PandaExpressProps {
  graphqlServices: Array<PandaGraphQL>;
  sessionStore?: Store;
  passport?: Authenticator;
  expressMiddlewares?: Array<ExpressMiddleware>;
  settings?: PandaExpressSettings;
}
