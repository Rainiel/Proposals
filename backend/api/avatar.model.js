const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
	user_id: { type: String, required: true },
	avatar_path: { type: String, required: true},
	avatar_photo : {type: String, required: true},
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Avatar', schema);