var User = require('./models/user');

module.exports = function(io, sessionMiddleware) {

	var useSession = function(socket, next) {
		sessionMiddleware(socket.request, {}, next);
	};

	var userStore = {}, // cache of users by id
		chatCache = []; // cache of previous message

	var chat = io
		.of('/chat')
		.use(useSession)
		.on('connection', function(socket) {

			var userId = socket.request.session.passport.user,
				chatSession = null,
				openChatSession = function() {
					var user = userStore[userId];
					chatSession = {
						role: user && user.role,
						role: (user && user.username) || 'guest'
					}
					console.log('session connected:');
					console.log(chatSession);
					// TODO: emit connected message here
				},
				closeChatSession = function() {
					console.log('session disconnected:');
					console.log(chatSession);	
				},
				initChatSession = function() {
					if(userStore[userId]) {
						return openChatSession();
					}
					User.findOne({ _id: userId }, function(err, user) {
						userStore[userId] = user;
						openChatSession();
					});
				};

			initChatSession();

			socket.on('disconnect', closeChatSession);	

		});

}
