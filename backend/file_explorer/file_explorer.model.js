const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
		folder_name: { type: String, required: true, unique: true},
		folder_parent: { type: String, required: true},
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Folder', schema);