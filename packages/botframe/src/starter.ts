import { init } from "./";
import { MachineEventType } from "./machine/types";

const cassette = {
  name: "Linkster",
  record: {
    regex: [/http:\/\/.+\.[a-zA-Z]+/]
  }
};

init()
  .onTransition(c => console.log(c.context))
  .send({
    type: MachineEventType.INITIALIZED,
    payload: {
      botName: "BOT-ONE",
      cassettes: [cassette]
    }
  });
