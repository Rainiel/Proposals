const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('database/db');
const Employee = db.Employee;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete
};

async function authenticate({ email, password }) {
    const employee = await Employee.findOne({ email });
    if (employee && bcrypt.compareSync(password, employee.hash)) {
        const { hash, ...employeeWithoutHash } = employee.toObject();
        const token = jwt.sign({ sub: employee.id }, config.secret);
        return {
            ...employeeWithoutHash,
            token
        };
    }
}

async function getAll() {
    return await Employee.find().select('-hash');
}

async function getById(id) {
    return await Employee.findById(id).select('-hash');
}

async function create(employeeParam) {
    // validate
    if (await Employee.findOne({ email: employeeParam.email })) {
        throw 'Email "' + employeeParam.email + '" is already taken';
    }

    const employee = new Employee(employeeParam);

    // hash password
    if (employeeParam.password) {
        employee.hash = bcrypt.hashSync(employeeParam.password, 10);
    }

    // to save raw password (not encrypted password)
    employee.raw_password = employeeParam.password;

    // save employee
    await employee.save();
}

async function update(id, employeeParam) {
    const employee = await Employee.findById(id);

    // validate
    if (!employee) throw 'Employee not found';
    if (employee.email !== employeeParam.email && await Employee.findOne({ email: employeeParam.email })) {
        throw 'Email "' + employeeParam.email + '" is already taken';
    }

    // hash password if it was entered
    if (employeeParam.password) {
        employeeParam.hash = bcrypt.hashSync(employeeParam.password, 10);
    }

    // copy employeeParam properties to employee
    Object.assign(employee, employeeParam);

    await employee.save();
}

async function _delete(id) {
    await Employee.findByIdAndRemove(id);
}