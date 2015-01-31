//var mongoose_song = require('mongoose');
//mongoose_song.createConnection('mongodb://admin:supersecreto@linus.mongohq.com:10064/MongoTesting');
var Song = require("../models/songs");
var User = require("../models/users");
var fs = require("fs");
var audioMetaData = require('audio-metadata');

module.exports = [
    {
        method: 'GET',
        path: '/',
        config: { 
            handler: function (request, reply) {
                //console.log("User: "+ JSON.stringify(request.auth.credentials));
                reply.view('index', { 
                    title: 'Music Player',  
                    user: { 
                        name: request.auth.credentials.firstname, 
                        email: request.auth.credentials.email,
                        id: request.auth.credentials._id
                    } 
                });
            },
            auth: "session" 
        }
    },
    {
        method: 'GET',
        path: '/home',
        handler: function (request, reply) {
            reply.view('index', { title: 'My home page' });
        },
    },
    {
        method: 'GET',
        path: '/media',
        handler: function (request, reply) {
            reply.view('media', { title: 'Media page' });
        }
    },
    {
        method: 'GET',
        path: '/songsList_JSON',
        handler: function (request, reply) {
            var songs = [
                { name: 'Ecstasy of Gold', author: "Metallica", url: "/songs/song.mp3" }, 
                { name: 'Unforgiven II', author: "Metallica", url: "/songs/song2.mp3" }
            ];
            return reply(songs).type('application/json');
        }
    },
    {
        method: 'POST',
        path: '/newSong',
        config: {
            handler: function (request, reply) {
                var filename = request.query.filename;
                var song = true;

                //var mp3Data = fs.readFileSync("./uploads/"+filename);
                var metadata = audioMetaData.id3v2(fs.readFileSync("./uploads/"+filename));
                if(Object.getOwnPropertyNames(metadata).length === 0)
                    metadata = audioMetaData.id3v1(fs.readFileSync("./uploads/"+filename));
                
                var song =  new Song({
                    name: metadata.title,
                    author: metadata.artist,
                    url: "/songs/" + filename 
                });

                if(song.name != "" && typeof song.name != "undefined" && filename != "" && typeof filename != "undefined"){
                    User.findOne({ email: request.auth.credentials.email }, function(err, user){
                        if(err){
                            console.log(err);
                        }
                        else{
                            user.update({ $push: { songs: song } }, {upsert: true}, function(err, user){
                                if(err)
                                    song = false;
                            });
                        }
                    });
                }
                else
                    song = false;

                return reply(song).type('application/json');
            },
            auth: "session" 
        }
    },
];