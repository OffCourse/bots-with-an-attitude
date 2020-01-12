import { interpret } from "xstate";
import { createModel } from "@xstate/test";
import TestMachine from "..";
import * as guards from "../guards";
import * as actions from "../actions";
import * as services from "./services";
import { DeckContext } from "../types";

const config = { guards, actions, services };

const init: (config?: any) => TestMachine = config => {
  const machine = TestMachine.withConfig(config);
  return interpret(machine).start();
};

describe("feedback app", () => {
  const machine = TestMachine.withConfig({ guards, actions, services });
  const testModel = createModel<TestMachine, DeckContext>(machine).withEvents(
    {}
  );

  const testPlans = testModel.getShortestPathPlans();
  testPlans.forEach(plan => {
    describe(plan.description, () => {
      plan.paths.forEach(path => {
        it(path.description, () => {
          const sut: TestMachine = init(config);
          return path.test(sut);
        });
      });
    });
  });

  it("coverage", () => {
    testModel.testCoverage();
  });
});
