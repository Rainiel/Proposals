const bcrypt = require('bcryptjs');
const db = require('database/db');
const Defense_week = db.Defense_week;

module.exports = {
    getAll,
    createWeek,
    update,
	delete: _delete
};

async function getAll() {
    return await Defense_week.find().select('-hash');
}

async function createWeek(scheduleParam){
    const week = new Defense_week(scheduleParam);

    // save user
    return await week.save()
}

async function update(id, scheduleParam){
	const week = await Defense_week.findById(id);

    // copy userParam properties to user
    Object.assign(week, scheduleParam);

    await week.save();
}

async function _delete(id){
    await User.findByIdAndRemove(id);
}