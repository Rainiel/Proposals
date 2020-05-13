const bcrypt = require('bcryptjs');
const db = require('database/db');
const Calendar = db.Calendar;

module.exports = {
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Calendar.find().select('-hash');
}

async function getById(id) {
    return await Calendar.findById(id).select('-hash');
}

async function create(eventParam) {
	const calendar = new Calendar(eventParam);
    // save employee
    return await calendar.save();
}

async function update(id, eventParam) {
    const calendar = await Calendar.findById(id);

    // copy eventParam properties to calendar
    Object.assign(calendar, eventParam);

    await calendar.save();
}

async function _delete(id) {
    await Calendar.findByIdAndRemove(id);
}