const express = require('express');
const router = express.Router();
const nodemailerService = require('./nodemailer.service');

// routes
router.get('/nodemail/:userId/:title', nodemail);
router.get('/mailDecision/:fname/:lname/:decision/:comment/:proposalId', mailDecision);

module.exports = router;

function nodemail(req, res, next){
	nodemailerService.nodemail(req.params.userId, req.params.title)
		.then(mail => res.json(mail))
		.catch(err => next(err));
}

function mailDecision(req,res,next){
	nodemailerService.mailDecision(req.params.fname, req.params.lname, req.params.decision, req.params.comment, req.params.proposalId)
	.then(mail => res.json(mail))
	.catch(err => next(err));
}
