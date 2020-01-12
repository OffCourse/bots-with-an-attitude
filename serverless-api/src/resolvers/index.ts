import { Resolvers, ApiEventType } from "../types/generated/graphql";
import { MachineEventType } from "@bwa/botframe/dist/machine/types";

const resolvers: Resolvers = {
  Query: {
    getStatus(_, __, { state }) {
      return state;
    }
  },
  Mutation: {
    sendEvent(_, { event }, { send }) {
      switch (event.eventType) {
        case ApiEventType.Initialized: {
          return send({
            type: MachineEventType.INITIALIZED,
            payload: event.payload!
          });
        }
        case ApiEventType.Reset: {
          return send({
            type: MachineEventType.RESET
          });
        }
      }
    }
  },
  Status: {
    currentState({ value }) {
      return value as string;
    },
    toJSON(state: any) {
      return JSON.stringify(state, null, 2);
    },
    affordances({ nextEvents }) {
      return nextEvents;
    }
  }
};

export default resolvers;
