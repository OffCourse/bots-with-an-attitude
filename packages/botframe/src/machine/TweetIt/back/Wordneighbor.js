getRecommendations("going to waag for some coding and ai related stuff.", 2).then(function (result) {
	console.log(result);
});

function prepareData(rawData) {
	let dataList = [];
	let count = 0;

	rawData.forEach(tweet => {
		let wordsInTweet = splitString(tweet);
		wordsInTweet.forEach(function (word, wordIndex) {
			let adjacentWords = [];

			// Amount of adjacent words to look for, in front of and behind the corresponding word
			let amountOfAdjacentWords = 1;

			// Add adjacent words to list
			for (let adjacentIndex = -amountOfAdjacentWords; adjacentIndex <= amountOfAdjacentWords; adjacentIndex++) {
				if (adjacentIndex != 0 && wordsInTweet[wordIndex + adjacentIndex] != null) {
					adjacentWords.push(wordsInTweet[wordIndex + adjacentIndex]);
				}
			}

			// Check whether word is already in the prepared data list
			// If so, concatenate the new vector of adjacent words to the old one
			// If not, add the new word with its vector to the prepared data list
			let wordInDataList = findWord(dataList, word);
			if (wordInDataList != null) {
				let oldVector = dataList[wordInDataList[0].index].vector;
				let newVector = oldVector.concat(adjacentWords);
				dataList[wordInDataList[0].index].vector = newVector;
			}
			else {
				dataList.push({ label: word, vector: adjacentWords, index: count++ });
			}
		});
	});
	return dataList;
}

function prepareTarget(dataList, targetLabel) {
	// Check whether target label (word) is in the prepared data list
	let targetInDataList = findWord(dataList, targetLabel);

	// Copy vector of adjacent words to target, if it's label has been found in the data list
	// If not, an empty list will be returned as a vector
	// An empty vector means that the inserted target label/word has no adjacent words
	let targetVector = [];
	if (targetInDataList != null) {
		targetVector = targetInDataList[0].vector.slice();
	}

	let target = { label: targetLabel, vector: targetVector };
	return target;
}

async function getRecommendations(targetTweet, recommendationsPerWord = 1) {
	targetTweet = targetTweet.toLowerCase();

	const Logic = require("./Logic");
	const saveFilePath = "./data/wordneighbor.json";
	const loadFilePath = "." + saveFilePath;

	// Try to fetch prepared data from the specified file path
	// If it cannot be found, the tweets will be retrieved (if not done already) and the data will be prepared and saved to the specified file path
	let preparedData;
	try {
		preparedData = require(loadFilePath);
	} catch (error) {
		const dataRetriever = require("./DataRetriever");
		const rawData = await dataRetriever.getTweets();
		preparedData = prepareData(rawData);
		saveData(preparedData, saveFilePath);
	}

	// Some words and punctuation marks are removed from the inserted target tweet
	targetTweet = await Logic.cleanSinglePost(targetTweet);
	// Target tweet is split into separate words
	const targetLabels = splitString(targetTweet);

	// For each word in the target tweet, the word is prepared (vector of adjacent words is added)
	// Each word is put into the evaluate function to retrieve recommendations
	// The amount of recommendations per word is limited by the 'recommendationsPerWord' parameter and is set to 1 by default
	let finalRecommendations = [];
	for (const targetLabel of targetLabels) {
		const preparedTarget = prepareTarget(preparedData, targetLabel);
		const recommendations = await evaluate(preparedData, preparedTarget);
		for (let index = 0; index < recommendationsPerWord; index++) {
			if (recommendations[index] != null) finalRecommendations.push(recommendations[index]);
		}
	}
	return finalRecommendations;
}

async function evaluate(data, target) {
	const Logic = require("./Logic");

	let targetInData = findWord(data, target.label);
	let recommendations = [];

	// If target label is present in the data, add each adjacent word to the recommendations list
	if (targetInData != null) {
		targetInData[0].vector.forEach(word => {
			if (word != target.label) recommendations.push(word);
		});
	}

	// Count all recommendations and put all words in order of frequency
	recommendations = Logic.countWords(recommendations);
	return recommendations;
}

function splitString(string) {
	let words = string.split(/\s+/);
	// eslint-disable-next-line quotes
	words = words.filter(word => word != ''); // Remove empty strings   
	return words;
}

function saveData(data, filePath) {
	console.log("begin writing");
	const fs = require("fs");
	fs.writeFile(filePath, JSON.stringify(data), function () { });
	console.log("done");
}

function findWord(data, word) {
	let wordInData = data.filter(element => {
		return element.label == word;
	});

	if (wordInData.length != 0) {
		return wordInData;
	} else { return null; }
}

module.exports.getRecommendations = getRecommendations;