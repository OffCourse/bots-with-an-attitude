import { assign, spawn } from "xstate";
import { MachineContext, MachineEvent } from "./types";
import testCassette from "../testCassette";
import Deck, { configuredDeck } from "../deck";

export const setBotName = assign<MachineContext, MachineEvent>({
  botName: (_context, { payload }: any) => payload.botName
});

export const setCassettes = assign<MachineContext, MachineEvent>({
  decks: (
    { controller }: MachineContext,
    { payload }: { payload: { cassettes: string[] } }
  ) => {
    const cassettes = payload.cassettes || [];
    return cassettes.map(name => {
      const machine = configuredDeck.withContext({
        cassette: { ...testCassette, name },
        controller
      });
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

const sendAll = (decks: Deck[], action: string) => {
  decks.map(({ ref }: any) => {
    ref.send(action);
  });
};

export const activate = ({ decks }: MachineContext) => {
  sendAll(decks, "ACTIVATE");
};
