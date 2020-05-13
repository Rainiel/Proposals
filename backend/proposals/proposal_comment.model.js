const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	proposal_id: { type: String, required: true },
	comment: { type: String, required: true },
	committee_id: { type: String, required: true },
	createdDate: { type: Date, default: Date.now },
	decision: { type: String, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Proposal_comment', schema);