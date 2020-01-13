import { SlackBot, createServer } from "bottender";
import { ApolloServer } from "apollo-server-express";
import botConfig from "@bwa/api";
import { init } from "@bwa/botframe";

const { path, ...slackConfig } = require("./bottender.config").channels.slack;

const bot = new SlackBot({
  ...slackConfig
});

bot.onEvent(() => {});

const machine = init(bot);

const graphql = new ApolloServer({
  ...botConfig,
  context: machine,
  playground: true
});

const server = createServer(bot, { path });

server.get("/", function(_req, res) {
  res.send(JSON.stringify(machine.state, null, 2));
});

graphql.applyMiddleware({ app: server, path: "/graphql" });

const PORT = 3333;
server.listen(PORT, () => {
  console.log(`server is running on ${3333} port...`);
  console.log(`graphql and playground endpoint under /graphql route`);
  console.log(`slackwebhook under /webhooks/slack route`);
});
