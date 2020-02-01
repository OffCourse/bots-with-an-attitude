import { assign, spawn } from "xstate";
import { MachineContext, MachineEvent } from "./types";
import { Cassette } from "../types";
import Deck from "../deck";

export const setBotName = assign<MachineContext, MachineEvent>({
  botName: (_context, { payload }: any) => payload.botName
});

export const setCassettes = assign<MachineContext, MachineEvent>({
  decks: (
    { controller }: MachineContext,
    { payload }: { payload: { cassettes: Cassette[] } }
  ) => {
    const cassettes = payload.cassettes || [];
    return cassettes.map(cassette => {
      const { name } = cassette;
      const machine = Deck.withContext({ cassette, controller });
      return {
        name,
        ref: spawn(machine, name)
      };
    });
  }
});

export const setStats = assign<MachineContext, MachineEvent>({
  stats: (_context, { payload }: any) => {
    return payload.stats;
  }
});

export const setError = assign<MachineContext, MachineEvent>({
  error: (_context, { type }) => {
    switch (type) {
      case "INITIALIZED": {
        return "invalid config";
      }
      case "FETCHED_STATS": {
        return "invalid stats";
      }
      default: {
        return "oops";
      }
    }
  }
});

export const reset = assign<MachineContext, MachineEvent>({
  decks: undefined,
  stats: undefined,
  error: undefined
});

export const activate = ({ decks }: MachineContext) => {
  decks.map(({ ref }: any) => {
    ref.send("ACTIVATE");
  });
};
