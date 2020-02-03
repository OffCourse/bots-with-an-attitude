import { init } from "./";
import { MachineEventType } from "./machine/types";

const machine = init().onTransition(c => console.log(c.value, c.context));

machine.send({
  type: MachineEventType.INITIALIZED,
  payload: {
    botName: "BOT-ONE",
    cassettes: ["linky-1", "linky-2"]
  }
});

machine.send({
  type: MachineEventType.ACTIVATE
});

machine.send({
  type: MachineEventType.RESET
});
