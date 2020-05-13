const expressJwt = require('express-jwt');
const config = require('config.json');
const userService = require('../users/user.service');
const employeeService = require('../employee/employee.service');

module.exports = jwt;

function jwt() {
    const secret = config.secret;
    return expressJwt({ secret, isRevoked }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate',
            '/users/register',
            '/employee/authenticate',
			'/employee/register',
			'/file/uploadPhoto',
            '/file/uploadFile',
            '/api/section_list',
            '/api/getCurrentBatch'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);
    const employee = await employeeService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user && !employee) {
        return done(null, true);
    }

    done();
};