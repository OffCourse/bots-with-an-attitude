import Machine from "../machine";
import { Bot } from "bottender";

export type MockController = {
  onEvent: () => void;
};

export type Controller = Bot<any, any, any> | MockController;

export type Cassette = {
  name: string;
};

export default Machine;
