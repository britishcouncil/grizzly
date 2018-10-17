import { PostGraphileOptions, postgraphile } from "postgraphile";
import { GrizzlyGraphQLServer } from "./types";
import { ServerRegistration } from "apollo-server-express";
import { Pool, PoolConfig } from "pg";

/**
 * Extends PostGraphile Config.
 */
export interface GrizzlyPostGraphileOptions extends PostGraphileOptions {
  pgConfig?: Pool | PoolConfig | string;
  schemaName?: string | Array<string>;
}

export class GrizzlyPostGraphile implements GrizzlyGraphQLServer {
  public endpoint: string;
  private options: PostGraphileOptions;
  constructor(options: GrizzlyPostGraphileOptions) {
    this.options = options || {};
    this.options.schemaName = this.options.schemaName || "public";
    this.endpoint = (this.options && this.options.graphqlRoute) || "/graphql";
  }
  public applyMiddleware(options: ServerRegistration) {
    options.app.use(
      postgraphile(this.options.pgConfig, this.options.schemaName, this.options)
    );
  }
}
