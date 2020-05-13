const express = require('express');
const router = express.Router();
const calendarService = require('./calendar.service');

// routes
router.post('/createEvent', create);
router.get('/', getAll);
router.put('/byId/:id', getById);
router.put('/updateEvent/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next) {
    calendarService.create(req.body)
        .then(event => res.json(event))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    calendarService.getAll()
        .then(events => res.json(events))
        .catch(err => next(err));
}

function getById(req, res, next) {
    calendarService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function update(req, res, next) {
    calendarService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    calendarService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}