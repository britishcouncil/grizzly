import { CookieOptions } from "express-serve-static-core";
import { CorsOptions } from "cors";
import { Store } from "express-session";
import { Authenticator } from "passport";
import { ServerRegistration } from "apollo-server-express";

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
  address?: string,
  cors?: CorsOptions;
  session?: SessionOptions;
}

/**
 * General interace for GraphQL servers.
 */
export interface GrizzlyGraphQLServer {
  endpoint?: string;
  applyMiddleware({
    app,
    path,
    cors,
    bodyParserConfig,
    disableHealthCheck,
    onHealthCheck
  }: ServerRegistration): void;
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
  graphqlServices: Array<GrizzlyGraphQLServer>;
  sessionStore?: Store;
  passport?: Authenticator;
  expressMiddlewares?: Array<ExpressMiddleware>;
  settings?: GrizzlyExpressSettings;
}
