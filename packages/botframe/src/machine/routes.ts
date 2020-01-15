const { text } = require("bottender/router");

const sayHello = async (context: any) => {
  await context.sendText("Hello World");
};

const sayGoodbye = async (context: any) => {
  await context.sendText("Farewell World");
};

const getRecommendations = async (_tweet: string) => {
  return ["one", "two", "three"];
};

const recommend = async (context: any) => {
  const recommendations = getRecommendations(context.event.text);
  await context.sendText(JSON.stringify(recommendations));
};

const routes = [
  text(["Hi", "Hello"], sayHello),
  text(/hashtag.+recommend/, recommend),
  text(["Bye", "Goodbye"], sayGoodbye)
];

export default routes;
