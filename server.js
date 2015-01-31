var Hapi = require('hapi');
var Swig = require('swig');
var bell = require('bell');
var hapiAuthCookie = require('hapi-auth-cookie');
var mongoose = require('mongoose');
var fs = require("fs");
var ss = require('socket.io-stream');
var path = require('path');

mongoose.connect('mongodb://admin:supersecreto@linus.mongohq.com:10064/MongoTesting');
//mongoose.createConnection('mongodb://localhost/test');

var server = new Hapi.Server();
server.connection({ port: 3000 });

Swig.setDefaults({ cache: false });
Swig.setDefaults({ varControls: ['<%=', '%>'] });

var User = require("./models/users");

server.views({
    path: "./views/",
    engines: {
        html: Swig
    },
    isCached: false
});

server.register(hapiAuthCookie , function (err) {
    server.auth.strategy('session', 'cookie', {
        password: 'secret',
        cookie: 'sid-example',
        redirectTo: '/login',
        isSecure: false
    });
});

// Register bell with the server
server.register(bell , function (err) {
    server.auth.strategy('google', 'bell', {
        provider: 'google',
        password: 'hapiauth',
        clientId: '246536898483-66qbs3lg8a6gt3p2atqh7i0r7ntd7t07.apps.googleusercontent.com', // fill in your Google ClientId here
        clientSecret: 'tfvNon7QVgwEGlGiQRtZoaKQ', // fill in your Google Client Secret here
        isSecure: false // Terrible idea but required if not using HTTPS
    });

    server.route({
        method: ['GET', 'POST'], // Must handle both GET and POST
        path: '/auth/google',  // The callback endpoint registered with the provider
        config: {
            auth: 'google',
            handler: function (request, reply) {
                if (!request.auth.isAuthenticated) {
                    return reply('Authentication failed due to: ' + request.auth.error.message);
                }

                var user =  new User({
                    firstname: request.auth.credentials.profile.name.first,
                    lastname: request.auth.credentials.profile.name.last,
                    email: request.auth.credentials.profile.raw.email
                });

                User.findOne({ email: user.email }, function (err, doc){
                    if(doc == null)
                    {
                        user.save(function (err, user) {
                            if (err) { 
                                console.log("Server: Error saving user");
                            }
                            else{
                                request.auth.session.set(user);
                                return reply.redirect('/'); 
                            }
                        });
                    }
                    else{
                        request.auth.session.set(user);
                        return reply.redirect('/'); 
                    }
                });
            }
        }
    });

    server.start(function () {
        console.log('Server running at:', server.info.uri);
    });
});

module.exports = server;

server.route(require('./routes/main'));
server.route(require('./routes/system'));

var io = require('socket.io')(server.listener);

io.on('connection', function (socket) {
    console.log("Connected socket");
    ss(socket).on('file', function(stream, data) {
        var filename = data.filename + Date.now() + ".mp3";

        stream.pipe(fs.createWriteStream("./uploads/"+filename));

        if (fs.existsSync("./uploads/"+filename)) {
            socket.emit('file_name', { filename: filename });
        }
    });
});

