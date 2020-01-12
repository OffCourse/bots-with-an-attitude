import { Botkit } from "botkit";
import { SlackEventMiddleware, SlackAdapter } from "botbuilder-adapter-slack";
import {
  SlackMessageTypeMiddleware,
  BotsAreUsersTooMiddleWare
} from "./BotsAreUsersTooMiddleWare";

require("dotenv").config();

console.log(process.env.CLIENT_SIGNING_SECRET);
console.log(process.env.BOT_TOKEN);

const adapter = new SlackAdapter({
  clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,
  redirectUri: "/install/auth",
  botToken: process.env.BOT_TOKEN
});

adapter.use(new BotsAreUsersTooMiddleWare());
adapter.use(new SlackEventMiddleware());
adapter.use(new SlackMessageTypeMiddleware());

const controller = new Botkit({
  webhook_uri: "/api/messages",
  adapter
});

controller.webserver.get("/", (_req: any, res: any) => {
  res.send(`This app is running Botkit ${controller.version}.`);
});

controller.webserver.get("/install", (_req: any, res: any) => {
  res.redirect(controller.adapter.getInstallLink());
});

controller.webserver.get("/install/auth", async (req: any, res: any) => {
  try {
    const results = await controller.adapter.validateOauthCode(req.query.code);
    console.log("FULL OAUTH DETAILS", results);
    res.json("Success! Bot installed.");
  } catch (err) {
    console.error("OAUTH ERROR:", err);
    res.status(401);
    res.send(err.message);
  }
});

const port = process.env.PORT;
console.log(`Your port is ${port}`);

export default controller;
