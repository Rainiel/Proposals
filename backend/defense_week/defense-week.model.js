const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	week: { type: String, required: true},
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Defense_week', schema);