const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    column: { type: String, unique: true, required: true }
});

schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Proposal_table_column', schema);