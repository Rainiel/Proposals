const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('database/db');
const Group = db.Group;

module.exports = {
    getAll,
    getById,
    create,
    update,
	delete: _delete,
	getProposalGroup
};

async function getAll() {
    return await Group.find().select('-hash');
}

async function getById(id) {
    return await Group.findById(id).select('-hash');
}

async function create(groupParam) {
    const group = new Group(groupParam);

    // save user
    return await group.save()
}

async function update(id, groupParam) {
	const group = await Group.findById(id);

    // copy userParam properties to user
    Object.assign(group, groupParam);

    return await group.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function getProposalGroup(id){
	return await Group.find({groupName: `${id}`, subject: 'Design_Project'});
}