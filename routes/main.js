module.exports = [
    {
        method: 'GET',
        path: '/',
        config: { 
            handler: function (request, reply) {
                console.log("User: "+ JSON.stringify(request.auth.credentials));
                reply.view('index', { title: 'My home page',  username: request.auth.credentials.email });
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
    }
];