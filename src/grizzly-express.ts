import * as express from "express";
import * as session from "express-session";
import { GrizzlyExpressProps, GrizzlyExpressSettings } from "./types";

/**
 * Wrapper around Express to build a "many Apollo Servers over One Express app" model.
 */
export class GrizzlyExpress {
  private spawnedServers: Array<{ endpoint: string; name: string }> = [];
  protected app: any;
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

  constructor(props: GrizzlyExpressProps) {
    this.app = express();
    // @TODO implement a deep merge of the settings.
    // Currently, once a level of settings is specified in the
    // constructor, all the nested properties that may have had
    // a default value are nullified, thus the required ones must
    // all be provided.
    this.settings = { ...this.settings, ...props.settings };

    // Set up a session in Express.
    if (props.sessionStore) {
      this.app.use(
        session({
          secret: this.settings.express.session.secret,
          cookie: this.settings.express.session.cookie,
          saveUninitialized: true,
          resave: true,
          store: props.sessionStore
        })
      );
    }

    // Add the passport middleware.
    if (props.passport) {
      this.app.use(props.passport.initialize());
      this.app.use(props.passport.session());
    }

    // Additional middlewares to add to Express.
    if (props.expressMiddlewares) {
      props.expressMiddlewares.forEach(em => {
        if (em.path == null) {
          this.app.use(em.function);
        } else {
          this.app.use(em.path, em.function);
        }
      });
    }

    // Register GraphQL servers with the express app.
    props.graphqlServices.forEach(s => {
      // Apollo servers.
      s.applyMiddleware({
        app: this.app,
        path: s.endpoint,
        cors: this.settings.express.cors
      });
      this.spawnedServers.push({
        endpoint: s.endpoint,
        name: s.constructor.name.replace("Grizzly", "")
      });
    });
  }

  public start = () => {
    // Fire it up!
    return this.app.listen({ port: this.settings.express.port }, () => {
      console.log("> 🐻 is alive and kicking at:");
      this.spawnedServers.forEach(ss => {
        console.log(
          `>> http://localhost:${this.settings.express.port}${ss.endpoint} (${
            ss.name
          })`
        );
      });
    });
  };
}
