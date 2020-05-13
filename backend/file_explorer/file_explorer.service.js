const bcrypt = require('bcryptjs');
const db = require('database/db');
const Folder = db.Folder;

module.exports = {
    getAll,
    create,
    update,
    delete: _delete
};

async function getAll() {
    return await Folder.find().select('-hash');
}

async function create(folder) {
    const currentFolder = new Folder(folder);

    // save user
    return await currentFolder.save()
}

async function update(id, scheduleParam) {
    const schedule = await Defense_schedule.findById(id);

    // copy userParam properties to user
    Object.assign(schedule, scheduleParam);

    await schedule.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}