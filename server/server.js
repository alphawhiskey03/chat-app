const express = require("express");
const { createServer } = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { execute, subscribe } = require("graphql");
const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB_CONNECTION_STRING } = require("./config");
const  {contextMiddleware,subscriptionAuth}  = require("./utils/context.utils");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require("./config");
const {PubSub}=require("graphql-subscriptions")
const { WebSocketServer } =require('ws');
const { useServer } =require('graphql-ws/lib/use/ws');
const pubsub=new PubSub();


(async () => {
  const app = express();
  const httpServer = createServer(app);
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });
  // const subscriptionServer = SubscriptionServer.create(
  //   {
  //     schema,
  //     execute,
  //     subscribe,
  //     async onConnect(connectionParams) {
  //     console.log(connectionParams)
  //       let user =subscriptionAuth(connectionParams)
  //       context.user=user
  //       return context
  //  },
  //   async onDisconnect(){
  //    console.log("subscription terminated")
  //  }
  //   },
  //   { server: httpServer, path: "/subscriptions" }
  // );

  const wsServer = new WebSocketServer({
    server: httpServer,  
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema,context:(ctx,msg,args)=>{
    let user=subscriptionAuth(ctx.connectionParams)
     ctx.user=user
     return ctx

  } }, wsServer);



  const server = new ApolloServer({
    schema,
    context: contextMiddleware,
    plugins: [
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          };
        },
      },
    ],
  });
  await server.start();
  server.applyMiddleware({ app });
  mongoose
    .connect(MONGODB_CONNECTION_STRING, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Connected to DB");
    });
  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log("Server is now running in PORT " + PORT);
  });
})();
