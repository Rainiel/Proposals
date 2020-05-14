const bcrypt = require('bcryptjs');
const db = require('database/db');
const Proposal = db.Proposal;
const File = db.File;
const Proposal_comment = db.Proposal_comment;
const Proposal_approve_reject = db.Proposal_approve_reject;
const Group = db.Group;
const User = db.User;
const nodemailer = require("nodemailer");
const mailer = {user: 'proposalsystemmailer@gmail.com', password: 'Proposal12345678'};

module.exports = {
	nodemail,
	mailDecision,
	approvedProposal
};

async function nodemail(userId, title) {
	console.log("nodemail");
	// let testAccount = await nodemailer.createTestAccount();

	let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'proposalsystemmailer@gmail.com', // generated ethereal user
      pass: 'Proposal12345678' // generated ethereal password
    },
		tls: {
				rejectUnauthorized: false
		}
	});
	
	let info = await transporter.sendMail({
    from: '"Proposal System" <proposalsystemmailer@gmail.com>', // sender address
    to: "villanuevarainiel@gmail.com", // list of receivers
    subject: "Title", // Subject line
    text: `${title}`, // plain text body
    html: `<b>Your group submitted a proposal ${title} </b>` // html body
	});
	
	return await info;
}

async function mailDecision(fname, lname, decision, comment, proposalId){
	const proposal = await Proposal.findById(proposalId).select('-hash');
	const group = await Group.findById(proposal.group_id).select('-hash');
	const user1 = await User.findById(group.groupMembers[0]._id).select('-hash');
	const user2 = await User.findById(group.groupMembers[1]._id).select('-hash');

	let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'proposalsystemmailer@gmail.com', // generated ethereal user
      pass: 'Proposal12345678' // generated ethereal password
    },
		tls: {
				rejectUnauthorized: false
		}
	});
	
	let info = await transporter.sendMail({
    from: '"Proposal System" <proposalsystemmailer@gmail.com>', // sender address
    to: `${user1.email}, ${user2.email}`,// list of receivers
    subject: "Decision", // Subject line
    html: `<b>${fname} ${lname} ${decision} your proposal because "${comment}"</b>` // html body
	});
	
	return await info;
}

async function approvedProposal(proposalId){
	const proposal = await Proposal.findById(proposalId).select('-hash');
	const group = await Group.findById(proposal.group_id).select('-hash');
	const user1 = await User.findById(group.groupMembers[0]._id).select('-hash');
	const user2 = await User.findById(group.groupMembers[1]._id).select('-hash');

	let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'proposalsystemmailer@gmail.com', // generated ethereal user
      pass: 'Proposal12345678' // generated ethereal password
    },
		tls: {
				rejectUnauthorized: false
		}
	});
	
	let info = await transporter.sendMail({
    from: '"Proposal System" <proposalsystemmailer@gmail.com>', // sender address
    to: `${user1.email}, ${user2.email}`,// list of receivers
    subject: "Approved", // Subject line
    html: `<b>Your Proposal is now approved</b>` // html body
	});
	
	return await info;
}