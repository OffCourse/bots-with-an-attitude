import { ApolloServer } from "apollo-server";
import config from "@bwa/api";

const server = new ApolloServer({
  ...config,
  playground: true
});

const PORT = 3333;

server
  .listen({ port: PORT })
  .then(({ url }: any) =>
    console.log(`\n🚀      GraphQL is now running on ${url}`)
  );
