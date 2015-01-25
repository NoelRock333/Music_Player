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
        reply.view('music', { title: 'My home page' });
        /*reply.view('media', { title: 'Media' });*/
    }

});

server.route({
    method: 'GET',
    path: '/{name}',
    handler: function (request, reply) {
        /*reply('Hello, ' + encodeURIComponent(request.params.name) + '!');*/
        reply.view('music', { title: 'My home page' });
    }
});


server.start(function () {
    console.log('Server running at:', server.info.uri);
});