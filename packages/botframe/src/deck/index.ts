import { Machine, Interpreter } from "xstate";
import { DeckContext, DeckState, DeckEvent } from "./types";

type Deck = Interpreter<DeckContext, DeckState, DeckEvent>;

const Deck = Machine<DeckContext, DeckState, DeckEvent>({
  initial: "empty",
  context: {},
  states: {
    empty: {}
  }
});

export default Deck;
