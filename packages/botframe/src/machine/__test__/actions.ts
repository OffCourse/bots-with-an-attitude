import { assign } from "xstate";
import { MachineContext, MachineEvent } from "../types";
import { setBotName, setStats, setError, reset } from "../actions";

const setCassettes = assign<MachineContext, MachineEvent>({
  decks: (_context: any, { payload }: any) => {
    const cassettes = payload.cassettes || [];
    return cassettes.map((name: { name: string }) => {
      return { name, ref: name };
    });
  }
});

const activate = () => {};

export { activate, setBotName, setStats, setError, reset, setCassettes };
