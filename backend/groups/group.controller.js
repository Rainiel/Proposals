const express = require('express');
const router = express.Router();
const groupService = require('./group.service');

// routes
router.post('/createGroup', createGroup);
router.get('/', getAll);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.get('/getGroupsBySection/:section/:year', getGroupsBySection);
router.put('/update/:id', update);
router.delete('/:id', _delete);
router.get('/getProposalGroup/:id', getProposalGroup);

module.exports = router;

function createGroup(req, res, next) {
    groupService.create(req.body)
        .then(group => res.json(group))
		.catch(err => next(err));
}

function getAll(req, res, next) {
    groupService.getAll()
        .then(groups => res.json(groups))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    groupService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getGroupsBySection(req, res, next){
    groupService.getGroupsBySection(req.params.section, req.params.year)
    .then(section => res.json(section))
    .catch(err => next(err));
}

function getById(req, res, next) {
    groupService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    groupService.update(req.params.id, req.body)
        .then(update => res.json(update))
		.catch(err => next(err));
}

function _delete(req, res, next) {
    groupService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getProposalGroup(req, res, next){
	groupService.getProposalGroup(req.params.id)
	.then(groups => res.json(groups))
	.catch(err => next(err));
}