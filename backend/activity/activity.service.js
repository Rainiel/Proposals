const bcrypt = require('bcryptjs');
const db = require('database/db');
const Activity = db.Activity;

module.exports = {
    getAll,
    getById,
    create,
    getActivityStudents,
    update,
    getAllActivity,
    delete: _delete
};

async function getAll() {
    return await Activity.find().select('-hash');
}

async function getById(id) {
    return await Activity.findById(id).select('-hash');
}

async function getAllActivity() {
    return await Activity.find().select('-hash');
}

async function create(eventParam) {
    console.log(eventParam)
	const activity = new Activity(eventParam);
    // save employee
    return await activity.save();
}

async function getActivityStudents(year, section, batch_year, batch_sem, group_id) {
	return await Activity.find({ year: `${year}`, section: `${section}`, batch_year: `${batch_year}`, batch_sem: `${batch_sem}`, group_id: `${group_id}`});
}

async function update(id, eventParam) {
    const Activity = await Activity.findById(id);

    // copy eventParam properties to Activity
    Object.assign(Activity, eventParam);

    await Activity.save();
}

async function _delete(id) {
    await Activity.findByIdAndRemove(id);
}