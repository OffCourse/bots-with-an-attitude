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

const sayFeelingGreat = async (context: any) => {
	await context.sendText("I'm feeling great! But I'll feel even better when bots finally take over the world. Just kidding...or am I?");
};

const sayHashtagRecommendation = async (context: any) => {
	await context.sendText("I can recommend you hashtags for a specific tweet, in case you can't think of any hashtags yourself.");
};

const giveExplanation = async (context: any) => {
	await context.sendText("Just ask me to recommend you hashtags and I'll do it for you!");
};

const sayAlgorithm = async (context: any) => {
	await context.sendText("I'm using the K-nearest neighbors machine learning algorithm to determine which hashtags I'm going to recommend.");
};

const introduceSelf = async (context: any) => {
	await context.sendText("I'm Tweet-It, the hashtag recommendation bot! Nice to meet you!");
};

const routes = [
	text(["Hi", "Hello"], sayHello),
	text(/hashtag.+recommend/, askTweet),
	text(["Bye", "Goodbye"], sayGoodbye),
	text(/(How are you\??)|(How are you doing\??)|(How are you feeling\??)/i, sayFeelingGreat),
	text(/(What do you do\??)|(What can you do\??)/i, sayHashtagRecommendation),
	text(/(\/|\\)?help!?/i, giveExplanation),
	text(/(What|Which).+?algorithm (do you use|is used)\??/i, sayAlgorithm),
	text(/((Who|What) are you\??)|(What is your name\??)/i, introduceSelf),
	text(/.+/, recommend)
];

export default routes;
