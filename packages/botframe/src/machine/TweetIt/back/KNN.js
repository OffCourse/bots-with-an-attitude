const tweetItModule = require("./TweetIt");
const dataRetriever = require("./DataRetriever");
const TweetIt = new tweetItModule();
const Logic = require("./Logic.js");
var bagOfWords = require("./BagOfWords.js"),
	bow = bagOfWords.bow,
	dict = bagOfWords.dict;
const tf = require("@tensorflow/tfjs");
const knnClassifier = require("@tensorflow-models/knn-classifier/dist/knn-classifier");
const fs = require("fs");

class KNN {
	constructor(username) {
		this.username = username;
		this.voc;
		this.classifier;
	}

	async getRecommendation(tweet, neighbors) {
		// exports.getRecommendation = async (tweet, neighbors, username) => {
		await this.init();
		var output = [];

		const cleanTweet = await Logic.cleanSinglePost(tweet);

		const result = await this.classifier.predictClass(tf.tensor(bow(cleanTweet, this.voc)), neighbors);
		//Put result in a list so it can be sorted
		for (var key in result.confidences) {
			output.push({
				key: key,
				confidence: result.confidences[key]
			});
		}
		output.sort(this.compare);
		return output;
	}

	async init() {
		try {
			this.classifier = knnClassifier.create();
			//Check if there is already a existing dataset knn can read.
			if (await this.loadDataset() && await this.loadVocabulary(this.voc)) {
				console.log("Dataset and vocabulary were succesfully loaded");
			} else {
				//Gets the vectorized dataset
				const object = await this.getVectorizedData();
				//Puts the new dataset in the classifier
				object.forEach(vector => {
					this.classifier.addExample(tf.tensor(vector.example), vector.label);
				});
				//Saves the dataset for the next time
				await this.saveDataset();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async getVectorizedData() {
		//Gets the raw data
		const text = await this.getRawData();
		//Saves the vocabulary
		await this.saveVocabulary(text);
		var result = [];
		//Get all hashtags out of tweets.
		text.forEach(post => {
			let temp = post.match(/#\w+/g);
			if (temp != null) {
				const vector = bow(post, this.voc);
				result.push({
					example: vector,
					label: temp[0]
				});
			}
		});
		// fs.writeFile(`./data/twitter_vector_${this.username}.json`, JSON.stringify(result), function () { });
		return result;
	}

	async getRawData() {
		try {
			const text = await dataRetriever.getTweets();
			return text;
		} catch (error) {
			//Get all tweets if there isn't a file available.
			const listOfPosts = await dataRetriever.getTweets();
			return listOfPosts;
		}
	}

	async saveDataset() {
		const dataset = await this.classifier.getClassifierDataset();
		const jsonDataset = [];

		for (var key in dataset) {
			jsonDataset.push({
				[key]: dataset[key].arraySync()
			});
		}
		fs.writeFile(`data/twitter_knn_dataset_${this.username}.json`, JSON.stringify(jsonDataset), function () {});
		console.log("Successfully saved the dataset for user [" + this.username + "]");
	}

	async loadDataset() {
		//Try to load an existing dataset
		try {
			const jsonDataset = await require(`../data/twitter_knn_dataset_${this.username}.json`);
			var dataset = {};
			for (var index in jsonDataset) {
				for (var key in jsonDataset[index]) {
					// console.log(jsonDataset[index][key]);
					dataset[key] = tf.tensor(jsonDataset[index][key]);
				}
			}

			this.classifier.setClassifierDataset(dataset);
			return true;
		} catch (error) {
			return false;
		}
	}

	async saveVocabulary(text) {
		this.voc = dict(text);
		fs.writeFileSync(`data/twitter_knn_vocabulary_${this.username}.json`, JSON.stringify(this.voc), function () {});
		console.log("Succesfully saved the vocabulary for user [" + this.username + "]");
	}

	async loadVocabulary() {
		//Try to load an existing vocabulary
		try {
			this.voc = await require(`../data/twitter_knn_vocabulary_${this.username}.json`);
			return true;
		} catch (error) {
			return false;
		}
	}

	compare(a, b) {
		return b.confidence - a.confidence;
	}
}

module.exports = KNN;