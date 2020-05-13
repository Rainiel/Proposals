const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/usersWithoutGroup/:section/:year', getUserWithoutGroup);
router.get('/current', getCurrent);
router.get('/:id', getById);
router.get('/getStudentsByYearAndSection/:year/:section', getStudentsByYearAndSection);
router.get('getAvatar/:id', getAvatar);
router.put('/update/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Email or password is incorrect' }))
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getUserWithoutGroup(req, res, next) {
    userService.getUserWithoutGroup(req.params.section, req.params.year)
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getCurrent(req, res, next) {
    userService.getById(req.user.sub)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAvatar(req, res, next) {
    userService.getAvatar(req.params.id)
        .then(avatar => res.json(avatar))
        .catch(err => next(err));
}

function getStudentsByYearAndSection(req, res, next) {
    userService.getStudentsByYearAndSection(req.params.year, req.params.section)
        .then(students => res.json(students))
        .catch(err => next(err));
}

function update(req, res, next) {
    userService.update(req.params.id, req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function _delete(req, res, next) {
    userService.delete(req.params.id)
        .then(() => res.json({}))
        .catch(err => next(err));
}