import { createModel } from "@xstate/test";
import TestMachine from "..";
import { init } from "../..";
import * as guards from "../guards";
import * as actions from "./actions";
import * as services from "./services";
import { MachineContext, MachineEventType } from "../types";
import context from "../defaultContext";

const { INITIALIZED, RESET, FETCHED_STATS } = MachineEventType;

const config = { guards, actions, services };

describe("feedback app", () => {
  const machine = TestMachine.withConfig(config).withContext(context);

  const testModel = createModel<TestMachine, MachineContext>(
    machine
  ).withEvents({
    INITIALIZED: {
      exec: ({ send }, { payload }: any) => {
        send({
          type: INITIALIZED,
          payload
        });
      },
      cases: [
        { payload: { botName: "1" } },
        { payload: { cassettes: ["HI", "AA", "KKK", "KKKK"] } },
        { payload: { botName: "2", cassettes: [] } },
        { payload: { botName: "3", cassettes: ["HI"] } },
        { payload: { botName: "4", cassettes: ["HI", "AA", "KKK"] } }
      ]
    },
    FETCHED_STATS: {
      exec: ({ send }, { payload }: any) => {
        send({ type: FETCHED_STATS, payload });
      },
      cases: [{ payload: {} }, { payload: { stats: { health: 50 } } }]
    },
    RESET: {
      exec: ({ send }) => {
        send({ type: RESET });
      }
    }
  });

  const testPlans = testModel.getShortestPathPlans();
  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(path.description, () => {
          const sut: TestMachine = init({ onEvent: () => {} }, config);
          return path.test(sut);
        });
      });
    });
  });

  it("coverage", () => {
    testModel.testCoverage();
  });
});
