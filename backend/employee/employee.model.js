const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	title: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	hash: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	createdDate: { type: Date, default: Date.now },
	raw_password: { type: String, required: true },
	status: { type: String, required: true },
	role: { type: String, requiredL: true },
	whole_name: { type: String, required: true },
	avatar_path: { type: String, required: true },
	avatar_photo: { type: String, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Employee', schema);