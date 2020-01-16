import context from "./defaultContext";

const { text } = require("bottender/router");
const Knn = require('./TweetIt/KNN.js')

const sayHello = async (context: any) => {
  await context.sendText("Hello World");
};

const sayGoodbye = async (context: any) => {
  await context.sendText("Farewell World");
};

const getRecommendations = async (_tweet: string) => {
  const knn = new Knn("yeehaa");
  const neighbors = 4;
  console.log("getting recommendations for tweet: ", _tweet)
  let result = await knn.getRecommendation(_tweet, neighbors)
  result = result.slice(0,3)
  result = result[0].key + " " + result[1].key + " " + result[2].key
  return result;
};

const recommend = async (context: any) => {
  const recommendations = await getRecommendations(context.event.text);
  await context.sendText(recommendations);
};

const routes = [
  text(["Hi", "Hello"], sayHello),
  text(/hashtag.+recommend/, recommend),
  text(["Bye", "Goodbye"], sayGoodbye)
];

export default routes;
