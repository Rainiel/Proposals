// module.exports = {
//     db: 'mongodb://localhost:27017/pafms'
//   };

const config = require('config.json');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || config.connectionString, { useCreateIndex: true, useNewUrlParser: true });
mongoose.Promise = global.Promise;

module.exports = {
	User: require('../users/user.model'),
	Employee: require('../employee/employee.model'),
	Group: require('../groups/group.model'),
	Proposal: require('../proposals/proposal.model'),
	Section_list: require('../api/section_list.model'),
	User_navigation: require('../api/user_navigation.model'),
	Employee_navigation: require('../api/employee_navigation.model'),
	Proposal_table_column: require('../api/proposal_table_column.model'),
	File: require('../proposals/proposal_file.model'),
	Proposal_comment: require('../proposals/proposal_comment.model'),
	Proposal_approve_reject: require('../proposals/proposal_approve_reject.model'),
	Defense_schedule: require('../defense-schedule/defense-schedule.model'),
	Calendar: require('../calendar/calendar.model'),
	Folder: require('../file_explorer/file_explorer.model'),
	Avatar: require('../api/avatar.model'),
	Current_batch: require('../api/current_batch.model'),
	Activity: require('../activity/activity.model'),
	Defense_week: require('../defense_week/defense-week.model')
};