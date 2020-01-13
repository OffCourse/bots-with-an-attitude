import express from "express";
import { ApolloServer } from "apollo-server-express";
import config from ".";

const app = express();
const machine = config.context;

const server = new ApolloServer({
  ...config,
  playground: true
});

app.get("/", function(_req, res) {
  res.send(JSON.stringify(machine.state, null, 2));
});

server.applyMiddleware({ app, path: "/graphql" });

const PORT = 3333;

app.listen({ port: PORT }, () => {
  console.log(`Apollo Server on http://localhost:${PORT}/graphql`);
});
