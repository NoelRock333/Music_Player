var Hapi = require('hapi');
var Swig = require('swig');
var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:supersecreto@linus.mongohq.com:10064/MongoTesting');

var server = new Hapi.Server();
server.connection({ port: 3000 });
Swig.setDefaults({ cache: false });

var userSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    email: String
});

var User = mongoose.model('User', userSchema);

server.views({
    path: "./views/",
    engines: {
        html: Swig
    },
    isCached: false
});


/*var validate = function(){
    console.log("session: "+ JSON.stringify(request.auth));
    if (request.auth.credentials != null) {
        return redirect("/login");
    }
}*/
server.register(require('hapi-auth-cookie'), function (err) {
    server.auth.strategy('session', 'cookie', {
        password: 'secret',
        cookie: 'sid-example',
        redirectTo: '/login',
        isSecure: false
    });
});

/*var validate = function (username, callback) {
    var user = users[username];
    if (!user) {
        return callback(null, false);
    }

    callback(err, isValid, { id: user.id, name: user.name });
};
*/

// Register bell with the server
server.register(require('bell'), function (err) {
    server.auth.strategy('google', 'bell', {
        provider: 'google',
        password: 'hapiauth',
        clientId: '246536898483-66qbs3lg8a6gt3p2atqh7i0r7ntd7t07.apps.googleusercontent.com', // fill in your Google ClientId here
        clientSecret: 'tfvNon7QVgwEGlGiQRtZoaKQ', // fill in your Google Client Secret here
        isSecure: false // Terrible idea but required if not using HTTPS
    });

    server.route({
        method: ['GET', 'POST'], // Must handle both GET and POST
        path: '/auth/google',          // The callback endpoint registered with the provider
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
                    if(err)
                    {
                        user.save(function (err, user) {
                            if (err) { 
                                console.log("Error saving user");
                            }
                            else{
                                console.log("User saved!");
                            }
                        });
                    }
                    else{
                        request.auth.session.set(user);
                        return reply.redirect('/'); 
                        //reply.view('index', { title: 'Index page', username: user.firstname });
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