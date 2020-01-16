async function prepareData(rawData) {
	var dataList = [];
	var count = 0;

	const encodedDictionary = createDictionary(rawData);
	rawData.forEach(string => {
		var words = splitString(string);
		words.forEach(function (word, wordIndex) {
			var values = [];
			var amountOfAdjacentWords = 1; //Amount of adjacent words to look for, in front of and behind the corresponding word
			for (var adjacentIndex = -amountOfAdjacentWords; adjacentIndex <= amountOfAdjacentWords; adjacentIndex++) {
				if (adjacentIndex != 0 && words[wordIndex + adjacentIndex] != undefined) {
					var wordInDictionary = encodedDictionary.filter(function (element) {
						return element.label === words[wordIndex + adjacentIndex];
					});
					values.push(wordInDictionary[0].label); //Note: change "label" to "value" when using K-means 
				}
			}

			if (dataList.some(element => element["label"] === word)) {
				var wordInDataList = dataList.filter(function (element) {
					return element.label === word;
				});
				var oldVector = dataList[wordInDataList[0].index].vector;
				var newVector = oldVector.concat(values);
				dataList[wordInDataList[0].index].vector = newVector;
			} else {
				dataList.push({
					label: word,
					vector: values,
					index: count++
				});
			}
		});
	});
	return dataList;
}

function prepareTarget(preparedData, targetLabel) {
	var target = {};
	if (preparedData.some(element => element["label"] === targetLabel)) {
		var targetInDataList = preparedData.filter(function (element) {
			return element.label === targetLabel;
		});
		target = {
			label: targetLabel,
			vector: targetInDataList[0].vector
		};
	} else {
		target = {
			label: targetLabel,
			vector: preparedData.length
		};
	}
	return target;
}

async function getUserData(username) {
	let returnData;
	const TweetItModule = require("../back/TweetIt");
	const TweetIt = new TweetItModule();
	await TweetIt.getText(username).then(function (result) {
		prepareData(result).then(function (res) {
			returnData = res;
			const fs = require("fs");
			fs.writeFile(`./data/${username}.json`, JSON.stringify(res), function () {});
		});
	});
	return returnData;
}

exports.getRecommendations = async(username, targetLabel) => {
	let preparedData;
	try {
		preparedData = require(`../data/${username}.json`);
	} catch (error) {
		preparedData = await getUserData(username);
	}
	const preparedTarget = prepareTarget(preparedData, targetLabel);
	const recommendations = evaluate(preparedData, preparedTarget);
	return recommendations;
};

function evaluate(data, target) {
	const Logic = require("../back/Logic");
	var recommendations = [];
	if (data.some(element => element["label"] === target.label)) {
		var targetInData = data.filter(function (element) {
			return element.label === target.label;
		});
		targetInData[0].vector.forEach(word => {
			if (word !== target.label) recommendations.push(word);
		});
	} else {
		//
	}
	recommendations = Logic.countWords(recommendations);
	return recommendations;
}

function createDictionary(data) {
	var dict = [];
	var count = 0;
	data.forEach(string => {
		var words = splitString(string);
		words.forEach(word => {
			if (!dict.some(element => element["label"] === word)) {
				dict.push({
					label: word,
					value: count++
				});
			}
		});
	});
	return dict;
}

function splitString(string) {
	var words = string.split(/\s+/);
	// eslint-disable-next-line quotes
	words = words.filter(word => word != ''); //Remove empty strings
	return words;
}