var Hapi = require('hapi');
var Swig = require('swig');

var server = new Hapi.Server();
server.connection({ port: 3000 });

Swig.setDefaults({ cache: false });

server.views({
    path: "./views/",
    engines: {
        html: Swig
    },
    isCached: false
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public',
            listing: true
        }
    }
});

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
        reply.view('index', { title: 'My home page' });
    }
});


server.route({
    method: 'GET',
    path: '/home',
    handler: function (request, reply) {
        reply.view('index', { title: 'My home page' });
    }
});

server.route({
    method: 'GET',
    path: '/login',
    handler: function (request, reply) {
        reply.view('login', { title: 'Login page' });
    }
});

/*server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
    }
});*/

server.start(function () {
    console.log('Server running at:', server.info.uri);
});


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
                console.log(request.auth.credentials);
                return reply.redirect('/home');
            }
        }
    });

    server.start();
});