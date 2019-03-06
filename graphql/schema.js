const {
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
  GraphQLFloat,
	GraphQLSchema,
	GraphQLList,
  GraphQLID,
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
		id: { type: GraphQLID },
		username: { type: GraphQLString },
    created: { type: GraphQLFloat },
    error: { type: ErrorType },
    exercises: {
      type: new GraphQLList(ExerciseType),
      args: {
        from: { type: GraphQLFloat },
        to: { type: GraphQLFloat },
        limit: { type: GraphQLInt }
      },
      resolve: ({ id }, args) => Exercises.findByUserId(id, args)
    }
	})
});

const ExerciseType = new GraphQLObjectType({
	name: "Exercise",
	fields: () => ({
		id: { type: GraphQLID },
    title: { type: GraphQLString },
		username: { type: GraphQLString },
    description: { type: GraphQLString },
    duration: { type: GraphQLInt },
    userId: { type: GraphQLID },
    date: { type: GraphQLFloat }
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
      args: {
        id: { type: GraphQLID },
        username: { type: GraphQLString }
      },
      resolve: (parentValue, { id, username }) => {
        if(id) return Users.findById(id)
        if(username) return Users.findByUsername(username)
      }
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
        userId: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        duration: { type: GraphQLInt },
        date: { type: GraphQLFloat }
      },
      resolve: (parentValue, args) => Exercises.addExercise(args)
    }
  }
})


module.exports = new GraphQLSchema({
	query: RootQueryType,
  mutation
});