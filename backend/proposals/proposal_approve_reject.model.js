const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	proposal_id: { type: String, required: true },
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	user_id: { type: String, required: true },
	decision: { type: String, required: true },
	title: { type: String, required: true },
	avatar_path: { type: String, required: true },
	avatar_photo: { type: String, required: true },
	createdDate: { type: Date, default: Date.now }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Proposal_approve_reject', schema);