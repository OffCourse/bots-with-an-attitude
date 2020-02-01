import { Machine, Interpreter } from "xstate";
import { assert } from "chai";
import { DeckContext, DeckState, DeckEvent } from "./types";

type Deck = Interpreter<DeckContext, DeckState, DeckEvent>;

const Deck = Machine<DeckContext, DeckState, DeckEvent>({
  initial: "active",
  context: {},
  states: {
    active: {
      type: "parallel",
      states: {
        listening: {
          initial: "off",
          on: {
            ACTIVATE: { target: "listening.on" },
            RECORD: { target: "recording.on" },
            IGNORE: { target: "recording.off" },
            MUTE: { target: "listening.off" }
          },
          states: {
            on: {
              meta: {
                test: ({ state }: Deck) => {
                  state.matches({
                    active: { listening: "on", recording: "off" }
                  });
                }
              }
            },
            off: {
              meta: {
                test: ({ state }: Deck) => {
                  state.matches({
                    active: { listening: "off", recording: "off" }
                  });
                }
              }
            }
          },
          meta: {
            test: ({ state }: Deck) => {
              assert.isTrue(state.matches({ active: "listening" }));
            }
          }
        },
        recording: {
          initial: "off",
          states: {
            off: {
              meta: {
                test: ({ state }: Deck) => {
                  state.matches({
                    active: { listening: {}, recording: "off" }
                  });
                }
              }
            },
            on: {
              meta: {
                test: ({ state }: Deck) => {
                  state.matches({ active: { listening: {}, recording: "on" } });
                }
              }
            }
          },
          meta: {
            test: ({ state }: Deck) => {
              assert.isTrue(state.matches("active"));
            }
          }
        }
      },
      meta: {
        test: ({ state }: Deck) => {
          assert.isTrue(state.matches("active"));
        }
      }
    }
  }
});

export default Deck;
