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
	{	
		// Logout Route
	    path: "/logout",
	    method: "GET",
	    config: {
	        handler: function(request, reply) {
	            request.auth.session.clear();
	            return reply.redirect('/');
	        }
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