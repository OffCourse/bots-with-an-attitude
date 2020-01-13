import { interpret } from "xstate";
import Machine from "./machine";
import * as actions from "./machine/actions";
import * as guards from "./machine/guards";
import * as services from "./machine/services";
import { BotController } from "./types";
import defaultContext from "./machine/defaultContext";

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

const init: (controller?: BotController, config?: BotConfig) => Machine = (
  controller,
  config = defaultConfig
) => {
  const context = controller
    ? { ...defaultContext, controller }
    : defaultContext;
  const botConfig = config || defaultConfig;
  const machine = Machine.withConfig(botConfig).withContext(context);
  return interpret(machine).start();
};

export { init };
