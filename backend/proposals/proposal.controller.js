const express = require('express');
const router = express.Router();
const proposalService = require('./proposal.service');

// routes
router.post('/create', create);
router.post('/proposalFile', proposalFile);
router.post('/comment', proposalComment);
router.post('/approve_reject/:proposal_id/:user_id', proposalApproveReject);
router.get('/get_approve_count/:id', getApproveCount);
router.get('/get_reject_count/:id', getRejectCount);
router.get('/get_approve_reject/:id', getApproveReject);
router.get('/getComment/:id', getProposalComment);
router.get('/getProposalFile/:id', getProposalFile);
router.get('/getOwnProposal/:id', getOwnProposal);
router.get('/checkProposalCommentIfExisting/:proposal_id/:committee_id', checkProposalCommentIfExisting);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.put('/update/:id', update);
router.put('/updateProposalComment/:proposal_id/:committee_id', updateProposalComment);
router.put('/updateComment/:id', updateComment);
router.put('/updateProposalDecision/:id', updateProposalDecision);
router.delete('/deleteComment/:id', deleteComment);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
	proposalService.create(req.body)
		.then(proposal => res.json(proposal))
		.catch(err => next(err));
}

function proposalApproveReject(req, res, next) {
	proposalService.proposalApproveReject(req.params.proposal_id, req.params.user_id, req.body)
		.then(decision => res.json(decision))
		.catch(err => next(err));
}

function proposalComment(req, res, next) {
	proposalService.proposalComment(req.body)
		.then(comment => res.json(comment))
		.catch(err => next(err));
}

function proposalFile(req, res, next) {
	proposalService.proposalFile(req.body)
		.then(file => res.json(file))
		.catch(err => next(err));
}

function getApproveCount(req, res, next) {
	proposalService.getApproveCount(req.params.id)
		.then(decisions => res.json(decisions))
		.catch(err => next(err));
}

function getRejectCount(req, res, next) {
	proposalService.getRejectCount(req.params.id)
		.then(decisions => res.json(decisions))
		.catch(err => next(err));
}

function getApproveReject(req, res, next) {
	proposalService.getApproveReject(req.params.id)
		.then(decisions => res.json(decisions))
		.catch(err => next(err));
}

function getProposalComment(req, res, next) {
	proposalService.getProposalComment(req.params.id)
		.then(comment => res.json(comment))
		.catch(err => next(err));
}

function getProposalFile(req, res, next) {
	proposalService.getProposalFile(req.params.id)
		.then(file => res.json(file))
		.catch(err => next(err));
}

function getOwnProposal(req, res, next) {
	proposalService.getOwnProposal(req.params.id)
		.then(proposal => res.json(proposal))
		.catch(err => next(err));
}

function checkProposalCommentIfExisting(req, res, next) {
	proposalService.checkProposalCommentIfExisting(req.params.proposal_id, req.params.committee_id)
		.then(proposal => res.json(proposal))
		.catch(err => next(err));
}

function getAll(req, res, next) {
	proposalService.getAll()
		.then(proposals => res.json(proposals))
		.catch(err => next(err));
}

function getCurrent(req, res, next) {
	proposalService.getById(req.user.sub)
		.then(user => user ? res.json(user) : res.sendStatus(404))
		.catch(err => next(err));
}

function getById(req, res, next) {
	proposalService.getById(req.params.id)
		.then(user => user ? res.json(user) : res.sendStatus(404))
		.catch(err => next(err));
}

function update(req, res, next) {
	proposalService.update(req.params.id, req.body)
		.then(updated => res.json(updated))
		.catch(err => next(err));
}

function updateProposalComment(req, res, next) {
	proposalService.updateProposalComment(req.params.proposal_id, req.params.committee_id, req.body)
		.then(updated => res.json(updated))
		.catch(err => next(err));
}

function updateComment(req, res, next) {
	proposalService.updateComment(req.params.id, req.body)
		.then(updated => res.json(updated))
		.catch(err => next(err));
}


function updateProposalDecision(req, res, next) {
	proposalService.updateProposalDecision(req.params.id, req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function _delete(req, res, next) {
	proposalService.delete(req.params.id)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function deleteComment(req, res, next) {
	proposalService.deleteComment(req.params.id)
		.then((data) => res.json({data}))
		.catch(err => next(err));
}