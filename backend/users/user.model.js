const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	email: { type: String, unique: true, required: true },
	hash: { type: String, required: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	createdDate: { type: Date, default: Date.now },
	raw_password: { type: String, required: true },
	role: { type: String, required: true },
	status: { type: String, required: true },
	year: { type: Number, required: true },
	section: { type: Number, required: true },
	group_proposal_id: { type: String, required: false },
	avatar_photo: { type: String, required: true },
	avatar_path: { type: String, required: true },
	created_batch_year: { type: String, required: true },
	created_batch_sem: { type: String, required: true },
	whole_name: { type: String, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', schema);