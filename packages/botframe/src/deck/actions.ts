import { DeckContext } from "./types";

const listen = ({ controller }: DeckContext) => {
  controller.onEvent(async context => {
    if (context.event.isBotMessage) {
      console.log(context.client);
    } else {
      await context.sendText("Hello World");
    }
  });
};

export { listen };
