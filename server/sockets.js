var User = require('./models/user');

module.exports = function(io, sessionMiddleware) {

	var useSession = function(socket, next) {
		sessionMiddleware(socket.request, {}, next);
	};

	var userStore = {}, // cache of users by id
		chatSessions = [],
		chatMessages = [];

	var chat = io
		.of('/chat')
		.use(useSession)
		.on('connection', function(socket) {

			// HANDLE SESSIONS
			// ==============================
			
			var userId = socket.request.session.passport.user,
				chatSession = null,

				initChatSession = function() {
					if (!userId) {
						return Promise.resolve(null);
					}
					if (userStore[userId]) {
						return Promise.resolve(userStore[userId]);
					}
					return User.findOne({ _id: userId }).exec();
				},

				openChatSession = function(user) {
					userStore[userId] = user;
					chatSession = {
						role: (user && user.role) || 0,
						username: (user && user.username) ||
									('guest #' + Math.floor(Math.random()*9999))
					}
					chatSessions.push(chatSession);
					socket.emit('initial payload', {
						session: chatSession,
						sessions: chatSessions,
						messages: chatMessages	
					});
					socket.broadcast.emit('session connected', chatSession);
				},

				closeChatSession = function() {
					// remove session by reference
					var idx = chatSessions.indexOf(chatSession);
					// catches case of session mismatch
					if ( idx >= 0 ) {
						chatSessions.splice(idx, 1);
					}
					socket.broadcast.emit('session disconnected', chatSession);
				}

			initChatSession()
				.then(openChatSession);

			socket.on('disconnect', closeChatSession);	

			// HANDLE MESSAGES 
			// ==============================

			socket.on('message', function(message) {
				if (!message) {
					return;
				}
				var m = {
					session: chatSession,
					message: message,
					sentAt: Date.now()
				};
				chatMessages.push(m);
				var trunc = chatMessages.length - 50;
				if ( trunc > 0 ) {
					chatMessages.splice(0, trunc);
				}
				socket.broadcast.emit('message', m);
			});


		});

}
