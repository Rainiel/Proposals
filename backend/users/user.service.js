const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('database/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getUserWithoutGroup,
    getById,
    create,
    getAvatar,
    getStudentsByYearAndSection,
    update,
    delete: _delete
};

async function authenticate({ email, password }) {
    const user = await User.findOne({ email });
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);
        return {
            ...userWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getUserWithoutGroup(section, year) {
    return await User.find({ group_proposal_id: null, section: `${section}`, year: `${year}` });
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function getAvatar(user_id) {
    return await User.find({ user_id: `${user_id}` });
}

async function getStudentsByYearAndSection(year, section) {
    return await User.find({ year: `${year}`, section: `${section}` });
}

async function create(userParam) {
    // validate
    if (await User.findOne({ email: userParam.email })) {
        throw 'Username "' + userParam.email + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // to save raw password (not encrypted password)
    user.raw_password = userParam.password;

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.email !== userParam.email && await User.findOne({ email: userParam.email })) {
        throw 'Email "' + userParam.email + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}