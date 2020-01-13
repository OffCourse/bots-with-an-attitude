import express from "express";
import bodyParser from "body-parser";
import { bottender } from "bottender";
import { ApolloServer } from "apollo-server-express";
import config from "@bwa/api";

const graphql = new ApolloServer({
  ...config,
  playground: true
});

const bot = bottender({
  dev: process.env.NODE_ENV !== "production"
});

const port = Number(process.env.PORT) || 3333;

const handle = bot.getRequestHandler();

bot
  .prepare()
  .then(() => {
    const app = express();

    app.use(
      bodyParser.json({
        verify: (req: any, _, buf) => {
          console.log(buf.toString());
          req.rawBody = buf.toString();
        }
      })
    );

    app.get("/api", (_req, res) => {
      res.json({ ok: true });
    });

    app.all("*", (req, res) => {
      console.log(bot);
      return handle(req, res);
    });

    // graphql.applyMiddleware({ app, path: "/graphql" });

    app.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(e => {
    console.log(e);
  });
