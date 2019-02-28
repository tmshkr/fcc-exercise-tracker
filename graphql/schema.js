const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = require("graphql");

const User = require('../models/User');
const Exercise = require('../models/Exercise');

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLString },
		username: { type: GraphQLString }
	})
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
			type: new GraphQLList(UserType),
			resolve: () => User.find({})
		}
  }
})


module.exports = new GraphQLSchema({
	query: RootQuery
});