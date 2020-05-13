const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	title: { type: String, unique: true, required: true },
	group_id: { type: String, required: true },
	year: { type: String, required: true },
	section: { type: String, required: true },
	createdDate: { type: Date, default: Date.now },
	approve: { type: Number, required: true },
	reject: { type: Number, required: true },
	status: { type: String, required: true },
	proposal_approve_reject: { type: Array, required: false }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Proposal', schema);