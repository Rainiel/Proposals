const express = require('express');
const router = express.Router();
const file_explorerService = require('./file_explorer.service');

// routes
router.post('/create', create);
router.get('/', getAll);
router.put('/update/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function create(req, res, next){
    file_explorerService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next){
    file_explorerService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function update(req, res, next){
    file_explorerService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next){
    file_explorerService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}