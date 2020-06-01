const express = require('express');
const router = express.Router();
const defenseService = require('./defense-week.service');

// routes
router.post('/createWeek', createWeek);
router.get('/', getAll);
router.put('/update/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function createWeek(req, res, next) {
    defenseService.createWeek(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    defenseService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function update(req, res, next) {
    defenseService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    defenseService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}
