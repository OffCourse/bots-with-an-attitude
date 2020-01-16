import context from "./defaultContext";

const { text } = require("bottender/router");
const Knn = require("./TweetIt/KNN.js");

let tweet = false;

const sayHello = async (context: any) => {
	await context.sendText("Hello World");
};

const sayGoodbye = async (context: any) => {
	await context.sendText("Farewell World");
};

const getRecommendations = async (_tweet: string) => {
	const knn = new Knn("yeehaa");
	const neighbors = 4;
	console.log("getting recommendations for tweet: ", _tweet);
	let result = await knn.getRecommendation(_tweet, neighbors);
	const resultsAmount = 5;
	let string = "";
	for (let index = 0; index < resultsAmount; index++) {
		string += result[index].key + " ";
	}
	return string;
};

const recommend = async (context: any) => {
	if (tweet) {
		const recommendations = await getRecommendations(context.event.text);
		tweet = false;
		await context.sendText(recommendations);
	}
	return;
};

const askTweet = async (context: any) => {
	if (!tweet) {
		await context.sendText(
			"What is the tweet you want hashtags to be recommended for?"
		);
    tweet = true;
	}
	return;
};

const routes = [
	text(["Hi", "Hello"], sayHello),
	text(/hashtag.+recommend/, askTweet),
	text(["Bye", "Goodbye"], sayGoodbye),
	text(/.+/, recommend)
];

export default routes;
