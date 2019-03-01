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
		username: { type: GraphQLString },
    exercises: {
      type: new GraphQLList(ExerciseType),
      args: {
        from: { type: GraphQLString },
        to: { type: GraphQLString },
        limit: { type: GraphQLInt }
      },
      resolve: ({ id }, args) => Exercise.findByUserId(id, args)
    }
	})
});

const ExerciseType = new GraphQLObjectType({
	name: "Exercise",
	fields: () => ({
		id: { type: GraphQLString },
		username: { type: GraphQLString },
    description: { type: GraphQLString },
    duration: { type: GraphQLInt },
    userId: { type: GraphQLString },
    date: { type: GraphQLString }
	})
});

const RootQueryType = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    users: {
			type: new GraphQLList(UserType),
			resolve: () => User.findAll()
		},
    user: {
      type: UserType,
      args: { id: { type: GraphQLString }},
      resolve: (parentValue, { id }) => User.findById(id)
    }
  }
})


module.exports = new GraphQLSchema({
	query: RootQueryType
});