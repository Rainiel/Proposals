const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	batch_year: { type: String, required: true },
	batch_sem: { type: String, required: true}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Current_batch', schema);