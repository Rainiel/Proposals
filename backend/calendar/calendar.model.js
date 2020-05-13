const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: true },
	start: { type: String, required: true },
	end: { type: String, required: false },
    editable: { type: Boolean, required: true },
    durationEditable: { type: Boolean, required: true },
    createdDate: { type: Date, default: Date.now },
    allDay: {type: Boolean, required: true}
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Calendar', schema);