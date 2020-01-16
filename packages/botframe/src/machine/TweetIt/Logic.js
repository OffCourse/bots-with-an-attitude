require("dotenv").config();
const rp = require("request-promise");
const discluded = require("./DiscludedWords.json");

function setOptions(username, maxId = 0, postsPerCall) {
	let options;
	if (maxId == 0) {
		options = {
			method: "GET",
			url: "https://api.twitter.com/1.1/statuses/user_timeline.json",
			qs: {
				screen_name: username,
				include_rts: 1,
				exclude_replies: true,
				count: `${postsPerCall}`,
				tweet_mode: "extended"
			},
			headers: {
				Authorization: "Bearer " + process.env.BEARER_TWITTER
			},
			json: true
		};
	} else {
		options = {
			method: "GET",
			url: "https://api.twitter.com/1.1/statuses/user_timeline.json",
			qs: {
				screen_name: username,
				include_rts: 1,
				exclude_replies: true,
				count: `${postsPerCall}`,
				tweet_mode: "extended",
				max_id: maxId
			},
			headers: {
				Authorization: "Bearer " + process.env.BEARER_TWITTER
			},
			json: true
		};
	}
	return options;
}

exports.getHashtags = async (username, postId = 0, postsPerCall) => {
	setOptions(username);
	let entries = [];
	let lastID;
	let totalPosts = 0;

	return rp(setOptions(username, postId, postsPerCall))
		.then(function (resp) {
			totalPosts = resp[0].user.statuses_count;
			for (let index = 0; index < resp.length; index++) {
				lastID = resp[index].id;

				try {
					if (resp[index].full_text.match(/RT \S+/)) {
						entries.push(resp[index].retweeted_status.full_text);
					} else {
						entries.push(resp[index].full_text);
					}
				} catch (error) {
					//
				}
			}
			return { entries: entries, lastID: lastID, totalPosts: totalPosts };
		})
		.catch(function (error) {
			console.log(error);
		});
};

exports.postCleanup = async (textList, username, hashtags) => {
	let cleanedList = [];
	await textList.forEach(async element => {
		let post = element;
		try {
			post = await cleanPost(post, username, hashtags);
			cleanedList.push(post);
		} catch (error) {
			//console.log(error);
		}
	});
	return cleanedList;
};

exports.cleanSinglePost = async (post, username) => {
	post = await cleanPost(post, username, false);
	return post;
};

exports.countWords = async (list) => {
	try {
		let countList = [];
		let splitList = [];
		list.forEach(el => {
			if (el.match(/\b(\w+)\b/g) != null) splitList.push(el.match(/\b(\w+)\b/g));
		});

		splitList.forEach(el => {
			el.forEach(element => {
				countList[element] = (countList[element] || 0) + 1;
			});
		});

		var sorted = Object.keys(countList).sort(function (a, b) {
			return countList[b] - countList[a];
		});

		return sorted;
		// console.log(sorted);
		// let topWords = [];
		// let ammountOfTopWords = x;
		// for (let index = 0; index < ammountOfTopWords; index++) {
		// 	topWords.push(sorted[index]);			
		// }
		// return topWords;
	} catch (error) {
		console.log(error);
	}
};

async function cleanPost(post, username, hashtags) {
	post = post.toLowerCase();
	var expStr = discluded.join("|");
	post = post.replace(/https?:\S+/g, "");										// remove urls
	post = post.replace(new RegExp(("\\b(" + expStr + ")\\b"), "g"), " ");		// remove discluded words
	post = post.replace(/\n/g, " ");											// remove breaklines
	if (hashtags == true) {
		post = post.replace(/[^a-z+ | ^#]/g, " ");								// remove non[a-z] chars, except #
	} else {
		post = post.replace(/[^a-z+]/g, " ");									// remove non[a-z] chars
	}
	post = post.replace(/(^| ).( |$)/g, " ");									// remove single letters
	post = post.replace(new RegExp(username, "g"), "");							// remove username
	//post = post.replace(/\s+/g, " ");											// replace multiple blank spaces with one
	return post;
}

exports.addUser = async (username) => {
	let userList = require("../data/users.json");
	const dataRetriever = require("../back/DataRetriever");
	let newUser = [];
	newUser.push(username);
	let Succeed = await dataRetriever.retrieveTweets(newUser);
	if (Succeed != null){
		if (!userList.some(element => element == username)) {
			console.log("Adding "+ username + " to the database.");
			userList.push(username);
			const fs = require("fs");
			fs.writeFile("./data/users.json", JSON.stringify(userList), function () { });
			dataRetriever.getTweets();
		} else console.log(username + " is already added to the database.");		
	}
};