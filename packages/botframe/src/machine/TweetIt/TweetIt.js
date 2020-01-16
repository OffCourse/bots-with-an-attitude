const Logic = require("./Logic");

class TweetIt {
	constructor() {}

	async classifyUsers(username) {
		let classifiedUsers = [];
		for (let index = 0; index < username.length; index++) {
			classifiedUsers.push(classify(username[index]));			
		}
		return classifiedUsers;
	}

	async getText(usr, hashtags){
		let lastId; 						// Id of last retrieved post
		let listOfPosts = [];				// List of retrieved posts
		let postsPerCall = 200; 			// Amount of posts to retrieve per call
		let retrievedPosts = 0; 			// Total amount of retrieved posts
		let totalPosts = 0; 				// Total amount of posts a user has posted
		const maxRetrievablePosts = 3200; 	// Amount of retrievable posts, limited by the API
		do {
			let object = await Logic.getHashtags(usr, lastId, postsPerCall);
			lastId = object.lastID; 
			retrievedPosts += postsPerCall;
			totalPosts = object.totalPosts;
			let posts = await Logic.postCleanup(object.entries, usr, hashtags);
			await posts.forEach(post => {
				listOfPosts.push(post);
			});
		} while (retrievedPosts < maxRetrievablePosts && retrievedPosts < totalPosts);
		return await listOfPosts;	
	}
}

module.exports = TweetIt;

async function classify(username) {
	const postData = require(`./user_data/twitter_${username}.json`);

	let cleanedPost = await Logic.postCleanup(postData, username);
	let topWords = await Logic.countWords(cleanedPost, username);
	return topWords;
}
