import { init } from "./";
import { MachineEventType } from "./machine/types";

init()
  .onTransition(c => console.log(c.context))
  .send({
    type: MachineEventType.INITIALIZED,
    payload: { botName: "hello", cassettes: ["HELLO", "HI", "GOODBY"] }
  });
