import { createMachine, Interpreter } from "xstate";
import { assert } from "chai";
import { includes } from "ramda";
import { MachineState, MachineContext, MachineEvent } from "./types";

type Machine = Interpreter<MachineContext, MachineState, MachineEvent>;

const Machine = createMachine<MachineContext, MachineEvent, MachineState>({
  initial: "dormant",
  context: {
    botName: undefined,
    ref: undefined,
    decks: undefined,
    stats: undefined,
    error: undefined
  },
  states: {
    dormant: {
      on: {
        INITIALIZED: [
          {
            target: "arising",
            cond: "isConfigValid",
            actions: ["setBotName", "setCassettes"]
          },
          {
            target: "maintenance",
            actions: "setError"
          }
        ]
      },
      meta: {
        test: ({ state: { context, value } }: Machine) => {
          assert.strictEqual(value, "dormant");
          assert.isUndefined(context.stats);
          assert.isUndefined(context.error);
          assert.isUndefined(context.decks);
        }
      }
    },
    arising: {
      invoke: {
        id: "fetchStats",
        src: "fetchStats"
      },
      on: {
        FETCHED_STATS: [
          {
            target: "alive",
            cond: "areStatsValid",
            actions: "setStats"
          },
          {
            target: "maintenance",
            actions: "setError"
          }
        ]
      },
      meta: {
        test: ({ state: { context, value } }: Machine) => {
          assert.strictEqual(value, "arising");
          assert.isUndefined(context.error);
          assert.isUndefined(context.stats);
          const decks = context.decks;
          assert.isAtLeast(decks!.length, 1);
          assert.isAtMost(decks!.length, 3);
        }
      }
    },
    alive: {
      on: {
        FETCHED_STATS: [
          { target: "alive", cond: "isContextValid" },
          { target: "maintenance", actions: "setError" }
        ],
        RESET: { target: "dormant", actions: "reset" }
      },
      meta: {
        test: ({ state: { context, value } }: Machine) => {
          assert.strictEqual(value, "alive");
          assert.isUndefined(context.error);
          assert.isObject(context.stats);
          assert.isNotEmpty(context.stats);
          const decks = context.decks;
          assert.isAtLeast(decks!.length, 1);
          assert.isAtMost(decks!.length, 3);
        }
      }
    },
    maintenance: {
      on: {
        RESET: { target: "dormant", actions: "reset" }
      },
      meta: {
        test: ({ state: { context, value } }: Machine) => {
          const errors = ["invalid config", "invalid stats"];
          assert.isTrue(includes(context!.error!, errors));
          assert.strictEqual(value, "maintenance");
        }
      }
    }
  }
});

export default Machine;
