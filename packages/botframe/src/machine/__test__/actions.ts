import { assign } from "xstate";
import { MachineContext, MachineEvent } from "../types";

export const setCassettes = assign<MachineContext, MachineEvent>({
  decks: (_context: any, { payload }: any) => {
    const cassettes = payload.cassettes || [];
    return cassettes;
  }
});
