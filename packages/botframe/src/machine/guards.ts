import { ConditionPredicate } from "xstate";
import { isEmpty, isNil } from "ramda";
import { MachineContext, MachineEvent } from "./types";

export const isConfigValid: ConditionPredicate<MachineContext, MachineEvent> = (
  _context,
  { payload }: any
) => {
  const areCassettesPresent =
    payload &&
    payload.cassettes &&
    payload.cassettes.length <= 3 &&
    payload.cassettes.length >= 1;
  const hasBotName = payload.botName;
  return !!(areCassettesPresent && hasBotName);
};

export const isContextValid: ConditionPredicate<
  MachineContext,
  MachineEvent
> = context => {
  const { decks, stats } = context;
  const areDecksPresent = decks && decks.length <= 3 && decks.length >= 1;
  const areStatsPresent = !isNil(stats) && !isEmpty(stats);
  const isValid = areDecksPresent && areStatsPresent;
  return !!isValid;
};

export const areStatsValid: ConditionPredicate<MachineContext, MachineEvent> = (
  _context,
  { payload }: any
) => {
  const { stats } = payload;
  return !!(stats && !isEmpty(stats));
};
