const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	navigation: { type: String, unique: true, required: true },
	boolean: { type: Boolean, required: true},
	child_nav : {type: Array, required: false},
	notification : { type: Array, required: false},
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Employee_navigation', schema);