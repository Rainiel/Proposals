const bcrypt = require('bcryptjs');
const db = require('database/db');
const Defense_schedule = db.Defense_schedule;

module.exports = {
    getAll,
    create,
    update,
	delete: _delete
};

async function getAll() {
    return await Defense_schedule.find().select('-hash');
}

async function create(scheduleParam){
    const schedule = new Defense_schedule(scheduleParam);

    // save user
    return await schedule.save()
}

async function update(id, scheduleParam){
	const schedule = await Defense_schedule.findById(id);

    // copy userParam properties to user
    Object.assign(schedule, scheduleParam);

    await schedule.save();
}

async function _delete(id){
    await User.findByIdAndRemove(id);
}