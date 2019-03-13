const express = require('express')
const app = express()

const cors = require('cors')

const expressGraphQL = require("express-graphql");
const schema = require("./graphql/schema");

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(
	"/graphql",
	expressGraphQL({
		schema,
		graphiql: true
	})
);

app.use(express.static('public'))


app.get('*', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
