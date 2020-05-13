const express = require('express');
const router = express.Router();
const apiService = require('./api.service');

// routes
router.get('/employee_navigation', getEmployeeNavigation);
router.get('/user_navigation', getUserNavigation);
router.get('/section_list', getSectionList);
router.get('/proposal_table_column', getProposalTableColumn);
router.get('/get_section_color/:year/:section', getSectionColor);
router.get('/getAvatar/:id', getAvatar);
router.get('/getAvatarCommittee/:id', getAvatarCommittee);
router.get('/getCurrentBatch', getCurrentBatch);
router.put('/updateAvatar', updateAvatar);
router.put('/selectAvatar', selectAvatar);
router.put('/user_nav/:nav_id', userNavigation);
router.put('/employee_nav/:nav_id', employeeNavigation);
router.put('/createYearAndSection', createYearAndSection);
router.get('/getSectionAdviser/:year/:section', getSectionAdviser);
router.put('/updateColorSection/:id', updateColorSection);
router.put('/section_adviser/:section', sectionAdviser);
router.put('/updateCurrentBatch', updateCurrentBatch);
router.put('/update/:id', update);
router.delete('/:id', _delete);

module.exports = router;

function getSectionColor(req, res, next) {
	apiService.getSectionColor(req.params.year, req.params.section)
		.then(color => { res.json(color) })
		.catch(err => next(err));
}

function register(req, res, next) {
	apiService.create(req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function getUserNavigation(req, res, next) {
	apiService.getUserNavigation()
		.then(navigations => res.json(navigations))
		.catch(err => next(err));
}

function getCurrentBatch(req, res, next) {
	apiService.getCurrentBatch()
		.then(batch => res.json(batch))
		.catch(err => next(err));
}

function getEmployeeNavigation(req, res, next) {
	apiService.getEmployeeNavigation()
		.then(navigations => res.json(navigations))
		.catch(err => next(err));
}

function getSectionList(req, res, next) {
	apiService.getSectionList()
		.then(sections => { res.json(sections) })
		.catch(err => next(err));
}

function getProposalTableColumn(req, res, next) {
	apiService.getProposalTableColumn()
		.then(sections => { res.json(sections) })
		.catch(err => next(err));
}

function getCurrent(req, res, next) {
	apiService.getById(req.user.sub)
		.then(user => user ? res.json(user) : res.sendStatus(404))
		.catch(err => next(err));
}

function getById(req, res, next) {
	apiService.getById(req.params.id)
		.then(user => user ? res.json(user) : res.sendStatus(404))
		.catch(err => next(err));
}

function getAvatar(req, res, next) {
	apiService.getAvatar(req.params.id)
		.then(avatar => res.json(avatar))
		.catch(err => next(err));
}

function getAvatarCommittee(req, res, next) {
	apiService.getAvatarCommittee(req.params.id)
		.then(avatar => res.json(avatar))
		.catch(err => next(err));
}

function createYearAndSection(req, res, next) {
	apiService.createYearAndSection(req.body)
		.then(YearAndSection => res.json(YearAndSection))
		.catch(err => next(err));
}

function updateCurrentBatch(req, res, next) {
	apiService.updateCurrentBatch(req.body)
		.then(currentBatch => res.json(currentBatch))
		.catch(err => next(err));
}

function updateAvatar(req, res, next) {
	apiService.updateAvatar(req.body)
		.then(avatar => res.json(avatar))
		.catch(err => next(err));
}

function selectAvatar(req, res, next) {
	apiService.selectAvatar(req.body)
		.then(avatar => res.json(avatar))
		.catch(err => next(err));
}

function getSectionAdviser(req, res, next) {
	apiService.getSectionAdviser(req.params.year, req.params.section)
		.then(adviser => res.json(adviser))
		.catch(err => next(err));
}

function updateColorSection(req, res, next) {
	apiService.updateColorSection(req.params.id, req.body)
		.then(color => res.json(color))
		.catch(err => next(err));
}

function sectionAdviser(req, res, next) {
	apiService.sectionAdviser(req.params.section, req.body)
		.then((adviser) => res.json(adviser))
		.catch(err => next(err));
}

function userNavigation(req, res, next) {
	apiService.userNavigation(req.params.nav_id, req.body)
		.then((adviser) => res.json(adviser))
		.catch(err => next(err));
}

function employeeNavigation(req, res, next) {
	apiService.employeeNavigation(req.params.nav_id, req.body)
		.then((adviser) => res.json(adviser))
		.catch(err => next(err));
}

function update(req, res, next) {
	apiService.update(req.params.id, req.body)
		.then(() => res.json({}))
		.catch(err => next(err));
}

function _delete(req, res, next) {
	apiService.delete(req.params.id)
		.then(() => res.json({}))
		.catch(err => next(err));
}