const express = require('express');
const router = express.Router();
const activityService = require('./activity.service');

// routes
router.post('/create', create);
router.get('/', getAll);
router.get('/getActivityStudents/:year/:section/:batch_year/:batch_sem', getActivityStudents);
router.put('/byId/:id', getById);
router.put('/updateEvent/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
    activityService.create(req.body)
        .then(event => res.json(event))
        .catch(err => next(err));
}

function getActivityStudents(req, res, next) {
    activityService.getActivityStudents(req.params.year, req.params.section, req.params.batch_year, req.params.batch_sem)
        .then(activity => res.json(activity))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    activityService.getAll()
        .then(events => res.json(events))
        .catch(err => next(err));
}

function getById(req, res, next) {
    activityService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    activityService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    activityService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}