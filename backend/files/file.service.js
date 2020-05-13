const bcrypt = require('bcryptjs');
const db = require('database/db');
const File = db.File;

module.exports = {
	getFile
};

async function proposalFile(proposalFileParam){
	const File = new File(proposalFileParam);

	return await File.save();
}

async function getFile(folder_parent){
	return await File.find({folder_parent: `${folder_parent}`});
}