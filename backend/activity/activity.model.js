const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    notification_users: { type: Array, required: true },
    user_id: { type: String, required: true },
    section: { type: Number, required: true },
    year: { type: Number, required: true },
    batch_year: { type: String, required: true },
    batch_sem: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, required: false },
    proposal_title: { type: String, required: false},
    group_members: { type: Array, required: false},
    group_name: { type: String, required: false },
    file_name: { type: String, required: false },
    createdDate: { type: Date, default: Date.now },
    group_id: { type: String, required: true},
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Activity', schema);