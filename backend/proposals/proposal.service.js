const bcrypt = require('bcryptjs');
const db = require('database/db');
const Proposal = db.Proposal;
const File = db.File;
const Proposal_comment = db.Proposal_comment;
const Proposal_approve_reject = db.Proposal_approve_reject;

module.exports = {
	getAll,
	getById,
	create,
	proposalFile,
	getProposalFile,
	proposalComment,
	getProposalComment,
	proposalApproveReject,
	getApproveReject,
	getApproveCount,
	getRejectCount,
	getOwnProposal,
	checkProposalCommentIfExisting,
	update,
	updateComment,
	updateProposalComment,
	updateProposalDecision,
	deleteComment,
	deletes: _delete
};


async function getAll() {
	return await Proposal.find().select('-hash');
}

async function getById(id) {
	return await Proposal.findById(id).select('-hash');
}

async function create(proposalParam) {
	const proposal = new Proposal(proposalParam);

	// save user
	return await proposal.save();
}

async function getOwnProposal(group_id) {
	return await Proposal.find({ group_id: `${group_id}` });
}

async function proposalApproveReject(proposal_id, user_id, decisionParam) {
	const proposal = await Proposal_approve_reject.find({ proposal_id: `${proposal_id}`, user_id: `${user_id}` });
	const decision = new Proposal_approve_reject(decisionParam);
	if ((proposal.length == 0 || proposal === undefined) || (proposal[0].proposal_id != proposal_id && proposal[0].user_id != user_id)) {
		return await decision.save();
	}
	else {
		return "Existing";
	}
}

async function getApproveCount(proposal_id) {
	return await Proposal_comment.find({ proposal_id: `${proposal_id}`, decision: 'approve' });
}

async function getRejectCount(proposal_id) {
	return await Proposal_comment.find({ proposal_id: `${proposal_id}`, decision: 'reject' });
}

// async function getApproveReject(proposal_id) {
// 	return await Proposal_approve_reject.find({ proposal_id: `${proposal_id}` });
// }

async function getApproveReject(proposal_id) {
	return await Proposal_comment.find({ proposal_id: `${proposal_id}` });
}

async function getProposalComment(proposal_id) {
	return await Proposal_comment.find({ proposal_id: `${proposal_id}` });
}

async function proposalComment(commentParam) {
	const proposal_comment = new Proposal_comment(commentParam);

	return await proposal_comment.save();
}

async function proposalFile(proposalFileParam) {
	const file = new File(proposalFileParam);

	return await file.save();
}

async function getProposalFile(proposal_id) {
	return await File.find({ proposal_id: `${proposal_id}` });
}

async function checkProposalCommentIfExisting(proposal_id, committee_id){
	return await Proposal_comment.find({ proposal_id: `${proposal_id}`, committee_id: `${committee_id}` });
}

async function update(id, proposalParam) {
	const proposal = await Proposal.findById(id);

	// copy proposalParam properties to user
	Object.assign(proposal, proposalParam);

	return await proposal.save();
}

async function updateProposalComment(proposal_id, committee_id, commentParam){
	const comment = await Proposal_comment.findOne({proposal_id: `${proposal_id}`, committee_id: `${committee_id}`});

	Object.assign(comment, commentParam);
	
	return await comment.save();
}

async function updateComment(id, commentParam) {
	const comment = await Proposal_comment.findById(id);

	// copy proposalParam properties to user
	Object.assign(comment, commentParam);
	console.log(comment)
	console.log(commentParam)
	return await comment.save();
}

async function updateProposalDecision(id, proposalParam) {
	const decision = await Proposal_approve_reject.findOne({ proposal_id: `${id}` });

	// copy proposalParam properties to user
	Object.assign(decision, proposalParam);
	console.log(decision);
	await decision.save();
}

async function deleteComment(id) {
	return await Proposal_comment.findByIdAndRemove(id);
}

async function _delete(id) {
	await Proposal.findByIdAndRemove(id);
}