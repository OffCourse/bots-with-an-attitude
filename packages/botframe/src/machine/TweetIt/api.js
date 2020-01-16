require("dotenv").config();
const cors = require("cors");
var Logic = require("./Logic");
const bodyParser = require("body-parser");
const express = require("express");
var Kmeans = require("./Kmeans");
const recommend = require("./Recommend");
const knnModule = require("./KNN.js");


const app = express();
app.use(bodyParser.json());

app.use(cors());

app.get("/", (req, res) => {
	return res.send("Received a GET HTTP method");
});

app.get("/getRecommend/:username/:tag", (req, res) => {
	recommend.getRecommendations(req.params.username, req.params.tag).then(function (result) {
		return res.send(result);
	});
});

app.post("/", (req, res) => {
	return res.send("Received a POST HTTP method");
});

app.post("/api/post", async function (req, res) {
	try {
		const tweet = [];
		const result = new Set();
		tweet.push(req.body.tweet);
		console.log(req.body.tweet);
		const cleanedWords = await Logic.postCleanup(tweet, "yeehaa");
		console.log("cleaned", cleanedWords);
		const arrayWords = await cleanedWords[0].replace(/\s\s+/g, " ").split(" ");
		console.log("array", arrayWords);
		for (var i = 0; i < arrayWords.length; i++) {
			console.log("Word: " + arrayWords[i]);
			const temp = await Kmeans.getRecommendations(arrayWords[i]);
			console.log("Temp: " + temp);
			for (var j = 0; j < 5; j++) {
				result.add(temp[j]);
			}
		}
		const endResult = JSON.stringify(Array.from(result));
		res.json(endResult);
	} catch (error) {
		console.log(error);
	}
});

app.post("/api/knn", async function (req, res) {
	const KNN = new knnModule(req.body.username);
	const result = await KNN.getRecommendation(req.body.tweet, 3);
	// const json = JSON.stringify(result);
	res.json(result);
});

app.post("/api/addUser", async function (req, res) {
	const username = req.body.username;
	Logic.addUser(username);
});

app.put("/", (req, res) => {
	return res.send("Received a PUT HTTP method");
});

app.delete("/", (req, res) => {
	return res.send("Received a DELETE HTTP method");
});

app.listen(process.env.API_PORT, () =>
	console.log(`Example app listening on port ${process.env.API_PORT}!`),
);