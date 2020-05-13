const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	groupName: { type: String, unique: true, required: true },
	groupType: { type: Number, required: true },
	groupMembers: { type: Array, required: true},
	createdDate: { type: Date, default: Date.now },
	subject: {type: String, required: true},
	year: { type: Number, required: true},
	section: {type: Number, required: true},
	panel1: { type: String, required: false},
	panel2: { type: String, required: false},
	panel3: { type: String, required: false}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Group', schema);