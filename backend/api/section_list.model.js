const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	year: { type: Number, required: true},
	section: { type: Number, required: true },
	color: { type: String, required: true},
	adviser_id: { type: String, required: true},
	adviser_whole_name: { type: String, required: true}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Section_list', schema);