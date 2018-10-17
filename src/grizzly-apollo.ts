import { ApolloServer, gql } from "apollo-server-express";
import { importSchema } from "graphql-import";
import { formatError } from "apollo-errors";
import { applyMiddleware } from "graphql-middleware";
import { Config as ApolloConfig } from "apollo-server-core";
import { GrizzlyGraphQLServer } from "./types";

/**
 * Extends ApolloServer Config.
 */
export interface GrizzlyApolloConfig extends ApolloConfig {
  schemaFile?: string;
  endpoint?: string;
  middlewares?: Array<any>;
}

/**
 * Extends ApolloServer for Express.
 *
 * Provides the ability:
 *  - to specify an endpoint to be used with an Express server.
 *  - to load the schema from an SDL file
 *  - to apply graphql-middleware(s) to the schema
 */
export class GrizzlyApollo extends ApolloServer
  implements GrizzlyGraphQLServer {
  public endpoint: string;

  constructor(options: GrizzlyApolloConfig) {
    let path = require("path");
    let fs = require("fs");

    // Provide a default if no formatError function is specified.
    options.formatError = options.formatError || formatError;

    // Support loading the schema from an SDL file.
    if (options.schemaFile) {
      let schemaPath = path.resolve(options.schemaFile);
      if (!fs.existsSync(schemaPath)) {
        throw new Error(`No schema found at: ${schemaPath}`);
      }
      options.typeDefs = gql`
        ${importSchema(schemaPath)}
      `;
    }

    // Invoke superclass' constructor.
    super(options);

    // Set endpoint for registering with Express.
    // Default to "/graphql" just like Apollo Server does.
    this.endpoint = options.endpoint || "/graphql";

    // Apply graphql-middlewares.
    if (options.middlewares) {
      this.schema = applyMiddleware(this.schema, ...options.middlewares);
    }
  }
}
