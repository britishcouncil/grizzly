<p align="center"><img src="http://www.iconarchive.com/download/i107368/google/noto-emoji-animals-nature/22261-panda-face.ico" width="80" /></p>

# graphql-panda

Slightly opinionated GraphQL server solution built on [Apollo Server 2.0](https://github.com/apollographql/apollo-server) and [Express](https://github.com/expressjs/express).

## Overview

- All the features of Apollo Server 2.0
- Support for [graphql-middleware](https://github.com/prisma/graphql-middleware)
- Support for [graphql-shield](https://github.com/maticzav/graphql-shield)
- Support for loading schemas from SDL files via [grapqhl-import](https://github.com/prisma/graphql-import)
- Create multiple GraphQL services (i.e. Apollo services) over a single Express application

## Install

```sh
yarn add graphql-panda # npm install graphql-panda
```

## Usage

### Quickstart

> To get started with `graphql-panda`, follow the instructions in the READMEs of the [examples](./examples).

### API

#### `PandaExpress`

##### `constructor(props: PandaExpressProps): PandaExpress`

The `props` argument accepts the following fields:

| **Key**              | **Type**                     | **Default** | **Notes**                                                                                                                                                                                  |
| -------------------- | ---------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `graphqlServices`    | Array of `PandaGraphQL`      | `null`      | See `PandaGraphQL` documentation below for more details about this type                                                                                                                    |
| `sessionStore`       | `Store`                      | `null`      | An instance of a session storage for Express server.                                                                                                                                       |
| `passport`           | `Authenticator`              | `null`      | An instance of a `passport` authenticator.                                                                                                                                                 |
| `expressMiddlewares` | Array of `ExpressMiddleware` | `null`      | Each `ExpressMiddleware` can have a `path` (optional) and a `function`, e.g. `{ path: "/hello-world", function: () => "Hello world!" }` or `{ function: () => console.log("Everything") }` |
| `settings`           | `PandaExpressSettings`       | See below   |                                                                                                                                                                                            |

Default PandaExpress settings:

```js
  protected settings: PandaExpressSettings = {
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

#### `PandaGraphQL`

##### `constructor(options: PandaGraphQLConfig): PandaGraphQL`

The `options` argument accepts all the parameters as the `options` argument by [Apollo Server 2.0](https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html#Parameters), but it also adds:

| **Key**       | **Type**                                                                          | **Default**  | **Notes**                                                                                                                                                           |
| ------------- | --------------------------------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `schemaFile`  | `string`                                                                          | `null`       | Path to a GraphQL schema written in SDL. If this parameter is specified, there will be no need to specify either `typeDefs` or `schema` (see Apollo Server options) |
| `endpoint`    | `string`                                                                          | `"/graphql"` | The endpoint with which register the GraphQL service to the Express app.                                                                                            |
| `middlewares` | `array` of [`GraphQLMiddleware`](https://github.com/graphcool/graphql-middleware) | `null`       |                                                                                                                                                                     |

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
```
