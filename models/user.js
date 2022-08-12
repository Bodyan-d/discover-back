import mongoose from 'mongoose';
import bCrypt from 'bcryptjs';

const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: [true, 'Username is required'],
	},
	email: {
		type: String,
		required: [true, 'Email required'],
		unique: true,
	},
	password: {
		type: String,
		required: [true, 'Password required'],
	},

	token: String,
});

userSchema.methods.setPassword = function (password) {
	this.password = bCrypt.hashSync(password, bCrypt.genSaltSync(6));
};

userSchema.methods.validPassword = function (password) {
	return bCrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
