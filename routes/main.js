var User = require("../models/users");
var fs = require("fs");
var musicTags = require('music-tags');

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
                var song = false;

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

                if(filename != "" && typeof filename != "undefined"){
                    var stream = fs.createReadStream("./uploads/"+filename);
                    musicTags(stream, function (err, meta) {
                        if (err) throw err

                        var song = {
                            name: "Desconocida",
                            author: "Desconocido",
                            url: "/songs/" + filename 
                        };

                        if(objectHasValues(meta)){
                            song = {
                                name: meta.title,
                                author: meta.artist[0],
                                url: "/songs/" + filename 
                            };
                        }

                        if(song.name != "" && typeof song.name != "undefined"){
                            User.findOne({ email: request.auth.credentials.email }, function(err, user){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    user.update({ $push: { songs: song } }, {upsert: true}, function(err, user){
                                        if(err)
                                            return reply(false).type('application/json');
                                        else
                                            return reply(song).type('application/json');
                                    });
                                }
                            });
                        }
                        else
                            return reply(false).type('application/json');
                    });
                }
                else
                    return reply(false).type('application/json');

            },
            auth: "session" 
        }
    },
];