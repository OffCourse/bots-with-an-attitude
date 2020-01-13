import { BwaConfig } from "../types/generated/graphql";

export enum MachineEventType {
  INITIALIZED = "INITIALIZED",
  RESET = "RESET",
  FETCHED_STATS = "FETCHED_STATS"
}

export type MachineStats = {
  health: number;
};

export interface MachineEvent {
  type: MachineEventType;
  payload?: BwaConfig | { stats: MachineStats };
}
export type BotController = { onEvent: (context: any) => void };

export type MachineContext = {
  controller: BotController;
  botName: string | undefined;
  decks: any;
  ref: any;
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
