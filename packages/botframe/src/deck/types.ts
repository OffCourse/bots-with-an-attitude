import { Controller, Cassette } from "../types";

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

export type DeckContext = {
  cassette: Cassette;
  controller: Controller;
};

export type DeckState = {
  value: "active";
  context: Required<DeckContext>;
};
