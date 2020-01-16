const { text } = require("bottender/router");
const Knn = require('./TweetIt/KNN.js')

const sayHello = async (context: any) => {
  await context.sendText("Hello World");
};

const sayGoodbye = async (context: any) => {
  await context.sendText("Farewell World");
};

const getRecommendations = async (_tweet: string) => {
  const knn = new Knn("");
  const neighbors = 4;
  return await knn.getRecommendations(_tweet, neighbors).split(0,3)
};

const recommend = async (context: any) => {
  console.log(context.event.text)
  const recommendations = getRecommendations(context.event.text);
  await context.sendText(JSON.stringify(recommendations));
};

const routes = [
  text(["Hi", "Hello"], sayHello),
  text(/hashtag.+recommend/, recommend),
  text(["Bye", "Goodbye"], sayGoodbye)
];

export default routes;
