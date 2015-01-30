//var mongoose = require('mongoose');
//mongoose.connect('mongodb://admin:supersecreto@linus.mongohq.com:10064/MongoTesting');

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
                var mongoose_song = require('mongoose');
                mongoose_song.createConnection('mongodb://admin:supersecreto@linus.mongohq.com:10064/MongoTesting');
                var name = request.query.name;
                var filename = request.query.filename;
                var author = request.query.author;
                var song = true;
                
                var song =  new Song({
                    name: name,
                    author: author,
                    url: "/songs/" + filename 
                });

                if(name != "" && typeof name != "undefined" && filename != "" && typeof filename != "undefined"){
                    var user = new User({ songs: [song] });
                    user.save(function (err, user) {
                        if (err) { 
                            console.log("Server: Error saving user");
                        }
                        else{
                            console.log("Guardado");
                        }
                    });
                    //song = { name: name, author: author, url: "/songs/"+ filename };
                }
                else
                    song = false;

                return reply(song).type('application/json');
            },
            auth: "session" 
        }
    },
];