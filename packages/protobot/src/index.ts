const { chain } = require("bottender");
const { router, slack } = require("bottender/router");
const fs = require("fs");

async function logMessage(context: any) {
  await context.sendText("HELLO");
}

async function TempApp(context: any, props: any) {
  await logMessage(context);
  return props.next;
}

async function StateMachineApp(context: any, _props: any) {
  console.log(context.state);
  return await logMessage(context);
}

async function App() {
  return chain([TempApp, StateMachineApp]);
}

export = App;
