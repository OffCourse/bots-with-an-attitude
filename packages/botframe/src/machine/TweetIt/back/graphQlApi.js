var express = require("express");
var express_graphql = require("express-graphql");
var { buildSchema } = require("graphql");
const knnModule = require("./KNN.js");
const cors = require("cors");

var schema = buildSchema(`
    type Query {
        knnResult(tweet: String!, userName: String!): [Result]
    },
    type Result {
        key: String
		confidence: Float
    }
`);

var getKnnResult = async function (args) {
	if (args.tweet && args.userName) {
		const KNN = new knnModule(args.userName);
		return await KNN.getRecommendation(args.tweet, 3);
	}
};

var root = {
	knnResult: getKnnResult
};

var app = express();
app.use("/graphQl", express_graphql ({
	schema: schema,
	rootValue: root,
	graphiql: true
}));
app.use(cors());
app.listen(process.env.API_PORT, () =>
	console.log(`Example app listening on port ${process.env.API_PORT}!`),
);
