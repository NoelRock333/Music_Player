module.exports = [
    {
        method: 'GET',
        path: '/',
        handler: function (request, reply) {
            reply.view('index', { title: 'My home page' });
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