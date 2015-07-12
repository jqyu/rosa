var mongoose		= require('mongoose'),
	crypto			= require('crypto');

var UserSchema = new mongoose.Schema({
	username: { type: String, match: /^[a-z0-9_-]{3,16}$/, unique: true, required: true },
	hashedPassword: String,
	salt: String,
	// roles:
	//  -1 : disabled
	//   0 : guest
	//   1 : regular user
	//   2 : ??? mod i guess ???
	//   3 : admin 
	// If email auth is introduced, this will default to 0
	role: { type: Number, default: 1 },
	provider: String
});

// virtuals ==============================

UserSchema
	.virtual('password')
	.set(function(password) {
		this._password		= password;
		this.salt			= crypto.randomBytes(16).toString('base64');
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function(password) {
		return this._password;
	});

// validations ===========================

// handles virtualization of password field
var validatePassword = function(password) {
	return password && password.length;	
}

// we don't add a validator for username uniqueness
// rather, sugarcoat the mongodb error message on save
// otherwise:
// UserSchema
//	.path('username')
//	.validate(function(value, respond) {
//		search for user and respond...
//	}, 'Username already in use');

// pre-save hook =========================

UserSchema
	.pre('save', function(next) {
		// TODO: validate password changes 
		if(!this.isNew) {
			return next();
		}
		// validates password for a new user
		if(!validatePassword(this.password)) {
			return next(new Error('Empty password'));
		}
		next();
		
	});

// methods ===============================

UserSchema
	.methods = {

		// check if passwords are the same
		authenticate: function(plainText) {
			return this.encryptPassword(plainText) === this.hashedPassword;
		},

		// encryption method
		encryptPassword: function(password) {
			if(!password || !this.salt) return '';
			var salt = new Buffer(this.salt, 'base64');
			return crypto
					.pbkdf2Sync(password, salt, 10000, 64)
					.toString('base64');
		}

	};

module.exports = mongoose.model('User', UserSchema);
