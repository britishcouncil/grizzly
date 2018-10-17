const { GrizzlyApollo, GrizzlyExpress } = require("../../dist");
const { gql } = require("apollo-server-express");

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for. A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    title:
      "The Way of the Grizzly: The Curious History of China's Political Animal",
    author: "Henry Nicholls"
  },
  {
    title: "American Grizzly",
    author: "Gloria Chao"
  }
];

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const booksTypeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const bookResolvers = {
  Query: {
    books: () => books
  }
};

// Create a GraphQL service for the Books service.
const bookServer = new GrizzlyApollo({
  typeDefs: booksTypeDefs,
  resolvers: bookResolvers,
  endpoint: "/books"
});

// Lather, rinse, repeat for Films.

const films = [
  {
    title: "Kung Fu Grizzly",
    director: ["Mark Osborne", "John Stevenson"]
  },
  {
    title: "Grizzlys",
    director: ["David Douglas", "Drew Fellman"]
  }
];

const filmsTypeDefs = gql`
  type Film {
    title: String
    director: [String]
  }

  type Query {
    films: [Film]
  }
`;

const filmResolvers = {
  Query: {
    films: () => films
  }
};

const filmServer = new GrizzlyApollo({
  typeDefs: filmsTypeDefs,
  resolvers: filmResolvers,
  endpoint: "/films"
});

// Create a new Express app serving both GraphQL services.
const app = new GrizzlyExpress({
  graphqlServices: [bookServer, filmServer]
});

// Launch the server.
app.start();
