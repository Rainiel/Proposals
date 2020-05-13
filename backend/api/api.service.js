const bcrypt = require('bcryptjs');
const db = require('database/db');
const Section_list = db.Section_list;
const Proposal_table_column = db.Proposal_table_column;
const User_navigation = db.User_navigation;
const Employee_navigation = db.Employee_navigation;
const Avatar = db.Avatar;
const User = db.User;
const Employee = db.Employee;
const Current_batch = db.Current_batch;

module.exports = {
	getUserNavigation,
	getEmployeeNavigation,
	getSectionList,
	getProposalTableColumn,
	getSectionColor,
	getAvatar,
	getAvatarCommittee,
	updateAvatar,
	sectionAdviser,
	userNavigation,
	updateColorSection,
	getCurrentBatch,
	selectAvatar,
	employeeNavigation,
	createYearAndSection,
	updateCurrentBatch,
	getSectionAdviser,
	update,
	delete: _delete
};

async function getSectionColor(year, section) {
	return await Section_list.find({ year: `${year}`, section: `${section}` });
}

async function getUserNavigation() {
	return await User_navigation.find().select('-hash');
}

async function getEmployeeNavigation() {
	return await Employee_navigation.find().select('-hash');
}

async function getSectionList() {
	return await Section_list.find().select('-hash');
}

async function getProposalTableColumn() {
	return await Proposal_table_column.find().select('-hash');
}

async function getAvatar(user_id) {
	return await User.findById(user_id);
}

async function getAvatarCommittee(user_id) {
	return await Employee.findById(user_id);
}

async function createYearAndSection(yearAndSection) {
	const yrAndSec = new Section_list(yearAndSection);
	return await yrAndSec.save();
}

async function getCurrentBatch() {
	return await Current_batch.find().select('-hash');
}

async function updateCurrentBatch(batch) {
	const current_batch = await Current_batch.find().select('-hash');

	Object.assign(current_batch[0], batch);
	// const batches = new Current_batch(batch);
	return await current_batch[0].save();
}

async function updateAvatar(user_avatar) {
	const avatar = await Avatar.findOne({ user_id: user_avatar.user_id });

	Object.assign(avatar, user_avatar);
	return await avatar.save();
}

async function updateColorSection(section_id, colorForm) {
	const color = await Section_list.findById(section_id);

	Object.assign(color, colorForm);
	return await color.save();
}

async function getSectionAdviser(year, section) {
	return await Section_list.find({ year: `${year}`, section: `${section}` });
}

async function selectAvatar(user_avatar) {
	const avatar = new Avatar(user_avatar);

	return await avatar.save();
}

async function sectionAdviser(section, adviser) {
	const section_number = await Section_list.findById(section);
	const ifAdviserExist = await Section_list.find({ adviser_id: `${adviser.adviser_id}` });
	console.log(ifAdviserExist)
	if ((ifAdviserExist.length == 0 || ifAdviserExist === undefined) || (ifAdviserExist[0].adviser_id != adviser.adviser_id)) {
		Object.assign(section_number, adviser);
		return await section_number.save();
	}
	else {
		return "ERROR";
	}
}

async function userNavigation(unav_id, boolean) {
	const user_nav = await User_navigation.findById(unav_id);
	console.log(user_nav);
	Object.assign(user_nav, boolean);
	return await user_nav.save();
}

async function employeeNavigation(unav_id, boolean) {
	const employee_nav = await Employee_navigation.findById(unav_id);
	Object.assign(employee_nav, boolean);
	return await employee_nav.save();
}

async function update(id, userParam) {
	const user = await User.findById(id);

	// copy userParam properties to user
	Object.assign(user, userParam);

	await user.save();
}

async function _delete(id) {
	await User.findByIdAndRemove(id);
}