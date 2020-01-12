import { ServiceConfig } from "xstate";
import { MachineContext, MachineEventType } from "./types";

const { FETCHED_STATS } = MachineEventType;

export const fetchStats: ServiceConfig<MachineContext> = () => callback => {
  return callback({
    type: FETCHED_STATS,
    payload: { stats: { health: 10 } }
  });
};
