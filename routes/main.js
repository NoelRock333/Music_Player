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
                        email: request.auth.credentials.email 
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
    }
];