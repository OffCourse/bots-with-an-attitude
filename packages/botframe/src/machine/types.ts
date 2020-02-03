import { BwaConfig as APIConfig } from "../types/generated/graphql";
import { Controller } from "../types";

export enum MachineEventType {
  INITIALIZED = "INITIALIZED",
  RESET = "RESET",
  FETCHED_STATS = "FETCHED_STATS",
  ACTIVATE = "ACTIVATE"
}

export type MachineStats = {
  health: number;
};

export interface MachineEvent {
  type: MachineEventType;
  payload?: APIConfig | { stats: MachineStats };
}

export type MachineContext = {
  controller: Controller;
  botName: string | undefined;
  decks: any;
  stats: MachineStats | undefined;
  error: string | undefined;
};

export type MachineState =
  | {
      value: "dormant";
      context: MachineContext;
    }
  | { value: "arising"; context: Required<MachineContext> }
  | {
      value: "alive";
      context: Required<MachineContext>;
    }
  | {
      value: "maintenance";
      context: MachineContext;
    };
