var mongoose_song = require('mongoose');
mongoose_song.createConnection('mongodb://admin:supersecreto@linus.mongohq.com:10064/MongoTesting');
var Song = require("../models/songs");

var userSchema = mongoose_song.Schema({
    firstname: String,
    lastname: String,
    email: String,
    songs: [songSchema]
});

var songSchema = mongoose_song.Schema({
    name: String,
    author: String,
    url: String
});

var User = mongoose_song.model('User', userSchema);

module.exports = User;