import { CookieOptions } from "express-serve-static-core";
import { CorsOptions } from "cors";
import { Store } from "express-session";
import { Authenticator } from "passport";
import { GrizzlyGraphQL } from "./grizzly-graphql";

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
 * Grizzly Express Settings.
 */
export interface GrizzlyExpressSettings {
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
 * Grizzly Express initialisation options.
 */
export interface GrizzlyExpressProps {
  graphqlServices: Array<GrizzlyGraphQL>;
  sessionStore?: Store;
  passport?: Authenticator;
  expressMiddlewares?: Array<ExpressMiddleware>;
  settings?: GrizzlyExpressSettings;
}
