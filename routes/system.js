module.exports = [
	{	// For access to assets
	    method: 'GET',
	    path: '/{param*}',
	    handler: {
	        directory: {
	            path: 'public',
	            listing: true
	        }
	    }
	},
	{	// For access to assets
	    method: 'GET',
	    path: '/songs/{param*}',
	    handler: {
	        directory: {
	            path: 'uploads',
	            listing: true
	        }
	    }
	},
	{	
		// Logout Route
	    path: "/logout",
	    method: "GET",
	    config: {
	        handler: function(request, reply) {
	            request.auth.session.clear();
	            return reply.redirect('/');
	        },
	        auth: "session"
	    }
	},
	{
	    method: 'GET',
	    path: '/login',
	    handler: function (request, reply) {
	        reply.view('login', { title: 'Login page' });
	    }
	}
];