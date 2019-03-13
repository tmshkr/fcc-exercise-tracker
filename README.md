# GraphQL Exercise Tracker

#### A microservice project, based on Free Code Camp's curriculum

This application uses the MERN stack (MongoDB, Express, React, Node) along
with GraphQL and Material-UI to allow the user to create a list of users, each of whom
can have a list of exercises with details.

### User Stories

1. I can use GraphiQL at [/graphql](https://tmshkr-fcc-exercise-tracker.glitch.me/graphql?query=%7B%0A%20%20users%20%7B%0A%20%20%20%20id%0A%20%20%20%20username%0A%20%20%20%20created%0A%20%20%20%20exercises%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%20%20title%0A%20%20%20%20%20%20duration%0A%20%20%20%20%20%20description%0A%20%20%20%20%20%20date%0A%20%20%20%20%20%20userId%0A%20%20%20%20%20%20username%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D) to interact with the database.
1. I can view a list of users at [/users](https://tmshkr-fcc-exercise-tracker.glitch.me/users).
1. I can add a user, and when attempting to add a username that is already in use, the input displays an error message, indicating that the username is taken.
1. I can view the list of a user's exercises by selecting their name from the UserList.
1. I can view a user's ExerciseList by navigating to [/user/:username/exercises](https://tmshkr-fcc-exercise-tracker.glitch.me/user/Michael/exercises).
1. I can add a new exercise to a user's ExerciseList.
1. I can view the details of an exercise entry by selecting it from a user's ExerciseList.
1. I can also view the details of an exercise entry by navigating to
[/user/:username/exercise/:id](https://tmshkr-fcc-exercise-tracker.glitch.me/user/Michael/exercise/cBEZouR8d).
1. I can edit the details of an exercise entry within its detail view.