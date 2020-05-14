require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('_helpers/jwt');
const errorHandler = require('_helpers/error-handler');

//For Socket io
const http = require('http');
const server = http.Server(app);
const socketIO = require('socket.io');
const io = socketIO(server);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/users', require('./users/user.controller'));
app.use('/group', require('./groups/group.controller'));
app.use('/employee', require('./employee/employee.controller'));
app.use('/file', require('./files/file.controller'));
app.use('/proposal', require('./proposals/proposal.controller'));
app.use('/api', require('./api/api.controller'));
app.use('/defense_schedule', require('./defense-schedule/defense-schedule.controller'));
app.use('/calendar', require('./calendar/calendar.controller'));
app.use('/file_explorer', require('./file_explorer/file_explorer.controller'));
app.use('/activity', require('./activity/activity.controller'));
app.use('/mail', require('./nodemailer/nodemailer.controller'));

// global error handler
app.use(errorHandler);

// start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
server.listen(port, () => {
	console.log('Connected to port '+ port)
});


const db = require('database/db');
const User = db.User;
const Proposal = db.Proposal;
const ApproveReject = db.Proposal_approve_reject;
const Proposal_comment = db.Proposal_comment;
const Section_list = db.Section_list;
//changeStreams
const streamUser = User.watch();
const streamProposal = Proposal.watch();
const streamApproveRejectProposal = ApproveReject.watch();
const streamProposal_comment = Proposal_comment.watch();
const streamSection_list = Section_list.watch();

streamUser.on("change", (change)  =>  {
	io.emit('userData', change);
});

streamProposal.on("change", (change)  =>  {
	io.emit('proposalData', change);
});

streamApproveRejectProposal.on("change", (change)  =>  {
	io.emit('ApproveRejectData', change);
});

streamProposal_comment.on("change", (change)  =>  {
	io.emit('ProposalCommentData', change);
});

streamSection_list.on("change", (change) => {
	io.emit('SectionListData', change);
});

io.on('connection', (socket) => {
	console.log('user connected');

	socket.on('disconnect', function(){
        console.log('user disconnected');
    });

});

