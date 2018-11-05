import * as express from "express";
import * as session from "express-session";
import { GrizzlyExpressProps, SessionOptions } from "./types";
import { CorsOptions } from "cors";

/**
 * Wrapper around Express to build a "many Apollo Servers over One Express app" model.
 */
export class GrizzlyExpress {
  // Names of the GraphQL servers added here.
  private graphqlServicesNames: Array<{ endpoint: string; name: string }> = [];
  // The Express app.
  protected app: any;
  // Server Port.
  protected port: string | number = process.env.PORT || 5000;
  // Server Host.
  protected host: string;
  // Cors options.
  protected cors: CorsOptions;
  // Session options.
  protected session: SessionOptions = {
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 3600000 } // 3600000ms = 1h.
  };
  // BodyParser configuration.
  protected bodyParser: Object | boolean = false;

  constructor(props: GrizzlyExpressProps) {
    this.app = express();

    // Merge defaults with props coming in.
    this.port = props.port || this.port;
    this.host = props.host || this.host;
    this.session = { ...this.session, ...props.session };
    this.cors = props.cors;
    this.bodyParser = props.bodyParser;

    // Set up a session in Express, if required.
    if (props.sessionStore) {
      this.app.use(
        session({
          secret: this.session.secret,
          cookie: this.session.cookie,
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
    if (props.middlewares) {
      props.middlewares.forEach(em => {
        if (em.path == null) {
          this.app.use(em.function);
        } else {
          this.app.use(em.path, em.function);
        }
      });
    }

    // Register GraphQL servers with the express app.
    props.graphqlServices.forEach(s => {
      // GraphQL services (either Apollo or PostGraphile).
      s.applyMiddleware({
        app: this.app,
        path: s.endpoint,
        cors: this.cors,
        bodyParserConfig: this.bodyParser
      });
      // Get the name of the service (taken from the constructor
      // name, and removing "Grizzly" from it.)
      this.graphqlServicesNames.push({
        endpoint: s.endpoint,
        name: s.constructor.name.replace("Grizzly", "")
      });
    });
  }

  public start = () => {
    // Fire it up!
    const server = this.app.listen(this.port, this.host, () => {
      console.log("> 🐻 is alive and kicking at:");
      this.graphqlServicesNames.forEach(ss => {
        // https://nodejs.org/api/net.html#net_server_listen
        console.log(
          `>> http://${server.address().address}:${server.address().port}${
            ss.endpoint
          } (${ss.name})`
        );
      });
    });
    return server;
  };
}
