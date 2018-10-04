<p align="center"><img src="https://raw.githubusercontent.com/britishcouncil/grizzly/master/.rsrc/bear.ico" width="80" /></p>

# @britishcouncil/grizzly

Slightly opinionated GraphQL server solution built on [Apollo Server 2.0](https://github.com/apollographql/apollo-server) and [Express](https://github.com/expressjs/express).

## Overview

- All the features of Apollo Server 2.0
- Support for [graphql-middleware](https://github.com/prisma/graphql-middleware)
- Support for [graphql-shield](https://github.com/maticzav/graphql-shield)
- Support for loading schemas from SDL files via [grapqhl-import](https://github.com/prisma/graphql-import)
- Create multiple GraphQL services (i.e. Apollo services) over a single Express application

## Install

```sh
yarn add @britishcouncil/grizzly # npm install @britishcouncil/grizzly
```

## Usage

### Quickstart

> To get started with `@britishcouncil/grizzly`, follow the instructions in the READMEs of the [examples](./examples).

### API

#### `GrizzlyExpress`

##### `constructor(props: GrizzlyExpressProps): GrizzlyExpress`

The `props` argument accepts the following fields:

| **Key**              | **Type**                     | **Default** | **Notes**                                                                                                                                                                                  |
| -------------------- | ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `graphqlServices`    | Array of `GrizzlyApollo`     | `null`      | See `GrizzlyApollo` documentation below for more details about this type                                                                                                                   |
| `sessionStore`       | `Store`                      | `null`      | An instance of a session storage for Express server.                                                                                                                                       |
| `passport`           | `Authenticator`              | `null`      | An instance of a `passport` authenticator.                                                                                                                                                 |
| `expressMiddlewares` | Array of `ExpressMiddleware` | `null`      | Each `ExpressMiddleware` can have a `path` (optional) and a `function`, e.g. `{ path: "/hello-world", function: () => "Hello world!" }` or `{ function: () => console.log("Everything") }` |
| `settings`           | `GrizzlyExpressSettings`     | See below   |                                                                                                                                                                                            |

Default GrizzlyExpress settings:

```js
  protected settings: GrizzlyExpressSettings = {
    express: {
      port: process.env.PORT || 5000,
      cors: {
        origin: [/https?:\/\/.*/],
        credentials: true
      },
      session: {
        secret: process.env.SESSION_SECRET,
        cookie: { maxAge: 10800000 } // 10800000ms = 3h.
      }
    }
  };
```

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

| **Key**      | **Type**                     | **Default** | **Notes**                                            |
| ------------ | ---------------------------- | ----------- | ---------------------------------------------------- |
| `pgConfig`   | `Pool | PoolConfig | string` | `null`      | PostgreSQL connection string or object.              |
| `schemaName` | `string | Array<string>;`    | `"public"`  | PostgreSQL schema(s) you to expose via PostGraphile. |

### Types

```typescript
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
  graphqlServices: Array<GrizzlyApollo>;
  sessionStore?: Store;
  passport?: Authenticator;
  expressMiddlewares?: Array<ExpressMiddleware>;
  settings?: GrizzlyExpressSettings;
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
