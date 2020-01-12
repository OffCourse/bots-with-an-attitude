import { interpret } from "xstate";
import Machine from "./machine";
import * as actions from "./machine/actions";
import * as guards from "./machine/guards";
import * as services from "./machine/services";

export type BotConfig = {
  actions: any;
  guards: any;
  services: any;
};

const defaultConfig = {
  actions,
  guards,
  services
};

const init: (config?: BotConfig) => Machine = config => {
  const botConfig = config || defaultConfig;
  const machine = Machine.withConfig(botConfig);
  return interpret(machine).start();
};

export { init };
