const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
		monday: { type: Array, required: true},
		tuesday: { type: Array, required: true},
		wednesday: { type: Array, required: true},
		thursday: { type: Array, required: true},
		friday: { type: Array, required: true},
		saturday: { type: Array, required: true}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Defense_schedule', schema);