export enum DeckEventType {
  ACTIVATE = "ACTIVATE",
  RECORD = "RECORD",
  IGNORE = "IGNORE",
  MUTE = "MUTE",
  STOP = "STOP"
}

export type DeckEvent = {
  type: DeckEventType;
};

export type DeckContext = {};

export type DeckState = {
  states: {
    active: {
      states: {
        listening: {
          states: {
            off: {};
            on: {};
          };
        };
        recording: {
          states: {
            off: {};
            on: {};
          };
        };
      };
    };
  };
};
