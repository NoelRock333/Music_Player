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
        config: {
            handler: function (request, reply) {
                User.findOne({ email: request.auth.credentials.email }, function(err, user){
                    if(err)
                        return reply([]).type('application/json');
                    return reply(user.songs).type('application/json');
                });
            },
            auth: "session" 
        }
    },
    {
        method: 'POST',
        path: '/newSong',
        config: {
            handler: function (request, reply) {
                var filename = request.query.filename;
                var song = true;
                var metadata = {};

                function objectHasValues(variable){
                    if( typeof variable == "object" && variable != null){
                        if( Object.getOwnPropertyNames(variable).length != 0 )
                            return true;
                        else
                            return false;
                    }
                    else
                        return false;
                }

                metadata = audioMetaData.id3v2(fs.readFileSync("./uploads/"+filename));
                if( !objectHasValues(metadata) )
                    metadata = audioMetaData.id3v1(fs.readFileSync("./uploads/"+filename));
                else if( !objectHasValues(metadata) )
                    metadata = audioMetaData.ogg(fs.readFileSync("./uploads/"+filename));
                else if( objectHasValues(metadata) ){
                    metadata.title ="Desconocida";
                    metadata.artist = "Desconocido";
                }
                else
                    return reply(false).type('application/json');

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