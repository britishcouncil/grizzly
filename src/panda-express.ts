import * as express from "express";
import * as session from "express-session";
import { PandaExpressProps, PandaExpressSettings } from "./types";

/**
 * Wrapper around Express to build a "many Apollo Servers over One Express app" model.
 */
export class PandaExpress {
  private endpoints: Array<string> = [];
  protected app: any;
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

  constructor(props: PandaExpressProps) {
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

    // Register apollo servers with the express app.
    props.graphqlServices.forEach(s => {
      s.applyMiddleware({
        app: this.app,
        path: s.endpoint,
        cors: this.settings.express.cors
      });
      this.endpoints.push(s.endpoint);
    });
  }

  public start = () => {
    // Fire it up!
    return this.app.listen({ port: this.settings.express.port }, () => {
      console.log("> 🐼 is alive and kicking at:");
      this.endpoints.forEach(e => {
        console.log(`>> http://localhost:${this.settings.express.port}${e}`);
      });
    });
  };
}
