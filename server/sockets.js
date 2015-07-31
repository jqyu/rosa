var User = require('./models/user');

module.exports = function(io, sessionMiddleware) {

	var useSession = function(socket, next) {
		sessionMiddleware(socket.request, {}, next);
	};

	var userStore = {}, // cache of users by id
		chatCache = {	// cache of chat state
			sessions: {},
			messages: []	
		};

	var chat = io
		.of('/chat')
		.use(useSession)
		.on('connection', function(socket) {

			// HANDLE SESSIONS
			// ==============================
			
			var userId = socket.request.session.passport.user,
				chatSession = null,

				initChatSession = function() {
					if (userStore[userId]) {
						return Promise.resolve(userStore[userId]);
					}
					return User.findOne({ _id: userId }).exec();
				},

				openChatSession = function(user) {
					userStore[userId] = user;
					chatSession = {
						role: (user && user.role) || 0,
						username: (user && user.username) || 'guest'
					}
					socket.emit('initial payload', chatCache);
					chat.emit('session connected', chatSession);
					// TODO: Return initialization request
					//			i.e. chat history and list of sessions 
					// TODO: Register session 
					console.log('session connected:', chatSession);
				},

				closeChatSession = function() {
					chat.emit('session disconnected', chatSession);
					// TODO: Teardown session
					console.log('session disconnected:', chatSession);
				}

			initChatSession()
				.then(openChatSession);

			socket.on('disconnect', closeChatSession);	

		});

}
