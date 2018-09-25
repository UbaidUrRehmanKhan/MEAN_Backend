const express = require('express'); 
const app = express(); 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('we are connected');
});

app.get('*', (req, res) => {
    res.send('Hello World');
});

// Start Server: Listen on port 8080
app.listen(8080, () => {
    console.log('Listening on port 8080');
});