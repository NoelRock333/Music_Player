var mongoose_song = require('mongoose');
mongoose_song.createConnection('mongodb://admin:supersecreto@linus.mongohq.com:10064/MongoTesting');

var songSchema = mongoose_song.Schema({
    name: String,
    author: String,
    url: String
});

var Song = mongoose_song.model('Song', songSchema);

module.exports = Song;