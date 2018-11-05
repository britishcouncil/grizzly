<p align="center"><img src="https://raw.githubusercontent.com/britishcouncil/grizzly/master/.rsrc/bear.ico" width="80" /></p>

# @britishcouncil/grizzly

Slightly opinionated GraphQL server solution built on [Apollo Server](https://github.com/apollographql/apollo-server), [PostGraphile](https://www.graphile.org/postgraphile) and [Express](https://github.com/expressjs/express).

## Overview

- All the features of the latest Apollo Server, plus
  - Support for [graphql-middleware](https://github.com/prisma/graphql-middleware)
  - Support for [graphql-shield](https://github.com/maticzav/graphql-shield)
  - Support for loading schemas from SDL files via [graphql-import](https://github.com/prisma/graphql-import)
- All the features of the latest PostGraphile
- Create multiple GraphQL services (i.e. Apollo or PostGraphile services) over a single Express application

## Install

```sh
yarn add @britishcouncil/grizzly # npm install @britishcouncil/grizzly
```

## Usage

### Quickstart

To get started with `@britishcouncil/grizzly`, have a look at the [examples](./examples).

### API

#### `GrizzlyExpress`

##### `constructor(props: GrizzlyExpressProps): GrizzlyExpress`

The `props` argument accepts the following fields:

| **Key**           | **Type**                        | **Default**                                                                              | **Notes**                                                                                                                                                                                  |
| ----------------- | ------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `graphqlServices` | Array of `GrizzlyGraphQLServer` | `null`                                                                                   | See `GrizzlyGraphQLServer` documentation below for more details about this type                                                                                                            |
| `sessionStore`    | `Store`                         | `null`                                                                                   | An instance of a session storage for Express server.                                                                                                                                       |
| `passport`        | `Authenticator`                 | `null`                                                                                   | An instance of a `passport` authenticator.                                                                                                                                                 |
| `middlewares`     | Array of `ExpressMiddleware`    | `null`                                                                                   | Each `ExpressMiddleware` can have a `path` (optional) and a `function`, e.g. `{ path: "/hello-world", function: () => "Hello world!" }` or `{ function: () => console.log("Everything") }` |
| `port`            | `string` or `number`            | `process.env.PORT` or `5000`                                                             | HTTP server port.                                                                                                                                                                          |
| `address`         | `string`                        | `localhost`                                                                              | HTTP server binding address.                                                                                                                                                               |
| `session`         | `SessionOptions`                | `{ secret: process.env.SESSION_SECRET, cookie: { maxAge: 3600000 } // 3600000ms = 1h. }` | Sessions options                                                                                                                                                                           |
| `cors`            | `CorsOptions`                   | `null`                                                                                   | Cors configuration.                                                                                                                                                                        |
| `bodyParse`       | `Object` or `boolean`           | `false`                                                                                  | The body-parser options: `false` removes the body parser middleware and `true` uses the defaults                                                                                           |

#### `GrizzlyApollo`

##### `constructor(options: GrizzlyApolloConfig): GrizzlyApollo`

The `options` argument accepts all the parameters as the `options` argument by [Apollo Server 2.0](https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html#Parameters), but it also adds:

| **Key**       | **Type**                                                                          | **Default**  | **Notes**                                                                                                                                                           |
| ------------- | --------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaFile`  | `string`                                                                          | `null`       | Path to a GraphQL schema written in SDL. If this parameter is specified, there will be no need to specify either `typeDefs` or `schema` (see Apollo Server options) |
| `endpoint`    | `string`                                                                          | `"/graphql"` | The endpoint with which register the GraphQL service to the Express app.                                                                                            |
| `middlewares` | `array` of [`GraphQLMiddleware`](https://github.com/graphcool/graphql-middleware) | `null`       |                                                                                                                                                                     |

#### `GrizzlyPostGraphile`

##### `constructor(options: GrizzlyPostGraphileOptions): GrizzlyPostGraphile`

The `options` argument accepts all the parameters as the `options` argument by [postgraphile()](https://www.graphile.org/postgraphile/usage-library/) (see also [`PostGrpahileOptions` interface](https://github.com/graphile/postgraphile/blob/master/src/interfaces.ts#L32)), but it also merges into it the other two parameters of the `postgraphile()` function:

| **Key**      | **Type**                           | **Default** | **Notes**                                            |
| ------------ | ---------------------------------- | ----------- | ---------------------------------------------------- |
| `pgConfig`   | `Pool` or `PoolConfig` or `string` | `null`      | PostgreSQL connection string or object.              |
| `schemaName` | `string` or `Array<string>`        | `"public"`  | PostgreSQL schema(s) you to expose via PostGraphile. |

### Types

```typescript
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

/**
 * Extends ApolloServer Config.
 */
export interface GrizzlyApolloConfig extends ApolloConfig {
  schemaFile?: string;
  endpoint?: string;
  middlewares?: Array<any>;
}

/**
 * Extends PostGraphile Config.
 */
export interface GrizzlyPostGraphileOptions extends PostGraphileOptions {
  pgConfig?: Pool | PoolConfig | string;
  schemaName?: string | Array<string>;
}
```
