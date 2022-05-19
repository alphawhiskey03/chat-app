const express = require("express");
const { createServer } = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB_CONNECTION_STRING } = require("./config");
const contextMiddleware =require("./utils/context.utils")
const mongoose = require("mongoose");

(async () => {
  const app = express();
  const httpServer = createServer(app);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  const subscriptionServer = SubscriptionServer.create(
    { schema, execute, subscribe },
    { server: httpServer, path: "/graphql" }
  );
  const server = new ApolloServer({
    schema,
    context: contextMiddleware,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close();
            },
          };
        },
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app });
  mongoose.connect(MONGODB_CONNECTION_STRING, {
    useNewUrlParser: true,
  }).then(()=>{
    console.log("Connected to DB")
  });
  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log("Server is now running in PORT " + PORT);
  });
})();
