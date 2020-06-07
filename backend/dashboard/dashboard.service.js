const bcrypt = require('bcryptjs');
const db = require('database/db');
const Dashboard = db.Dashboard;

module.exports = {
    getAll,
    create,
    update,
	delete: _delete
};

async function getAll() {
    return await Defense_week.find().select('-hash');
}

async function create(scheduleParam){
    const week = new Defense_week(scheduleParam);
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