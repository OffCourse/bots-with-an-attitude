const { text } = require("bottender/router");

const sayHello = async (context: any) => {
  await context.sendText("Hello World");
};

const sayGoodbye = async (context: any) => {
  await context.sendText("Farewell World");
};

const routes = [
  text(["Hi", "Hello"], sayHello),
  text(["Bye", "Goodbye"], sayGoodbye)
];

export default routes;
