const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	proposal_id: { type: String, required: true },
	file_path: { type: String, required: true },
	file_name: { type: String, required: true },
	folder_parent: { type: String, required: true },
	createdDate: { type: Date, default: Date.now },
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('file', schema);