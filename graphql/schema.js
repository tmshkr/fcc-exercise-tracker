const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLSchema,
	GraphQLList,
	GraphQLNonNull
} = require("graphql");

const Users = require('../models/User');
const Exercises = require('../models/Exercise');

const ErrorType = new GraphQLObjectType({
  name: "Error",
  fields: () => ({
    code: { type: GraphQLInt }
  })
});

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLString },
		username: { type: GraphQLString },
    created: { type: GraphQLString },
    error: { type: ErrorType },
    exercises: {
      type: new GraphQLList(ExerciseType),
      args: {
        from: { type: GraphQLString },
        to: { type: GraphQLString },
        limit: { type: GraphQLInt }
      },
      resolve: ({ id }, args) => Exercises.findByUserId(id, args)
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
			resolve: () => Users.findAll()
		},
    user: {
      type: UserType,
      args: { id: { type: GraphQLString }},
      resolve: (parentValue, { id }) => Users.findById(id)
    }
  }
})

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addUser: {
      type: UserType,
      args: { username: { type: new GraphQLNonNull(GraphQLString) }},
      resolve: (parentValue, { username }) => Users.newUser(username)
    },
    addExercise: {
      type: ExerciseType,
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        duration: { type: GraphQLInt },
        date: { type: GraphQLString }
      },
      resolve: (parentValue, args) => Exercises.addExercise(args)
    }
  }
})


module.exports = new GraphQLSchema({
	query: RootQueryType,
  mutation
});