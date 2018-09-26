// const express = require('express'); 
// const app = express(); 
// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
// var db = mongoose.connection;

// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log('we are connected');
// });

// app.get('*', (req, res) => {
//     res.send('Hello World');
// });

// app.listen(8080, () => {
//     console.log('Listening on port 8080');
// });

const express = require('express'); // Fast, unopinionated, minimalist web framework for node.
const app = express(); // Initiate Express Application
const router = express.Router(); // Creates a new router object.
const mongoose = require('mongoose'); // Node Tool for MongoDB
const config = require('./config/database'); // Mongoose Config
const authentication = require('./routes/authentication')(router); // Import Authentication Routes
const bodyParser = require('body-parser')
// Database Connection
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, {useNewUrlParser: true}, (err) => {
  if (err) {
    console.log('Could NOT connect to database: ', err);
  } else {
    console.log('Connected to database: ' + config.db);
  }
},);
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.use('/authentication', authentication);

// Start Server: Listen on port 8080
app.listen(8080, () => {
  console.log('Listening on port 8080');
});