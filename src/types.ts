import { CookieOptions } from "express-serve-static-core";
import { CorsOptions } from "cors";
import { Store } from "express-session";
import { Authenticator } from "passport";
import { ServerRegistration } from "apollo-server-express";

/**
 * Session options.
 */
export interface SessionOptions {
  secret?: string;
  cookie?: CookieOptions;
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
  middlewares?: Array<ExpressMiddleware>;
  port?: string | number;
  address?: string;
  cors?: CorsOptions;
  session?: SessionOptions;
  bodyParser?: Object | boolean;
}
