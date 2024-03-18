const fs = require('fs');
const fileName = './tt-usernames.json';
const file = require(fileName);

function updateUsernames(name){
	file.key = "new value";

	fs.writeFile(fileName, JSON.stringify(file), function writeJSON(err) {
	  if (err) return console.log(err);
	  console.log(JSON.stringify(file));
	  console.log('writing to ' + fileName);
	});
}

function readUsernames(){
	return [
			"yohn.john",
			"aviannaav",
			"babysitterhk",
	];
}

module.exports = {
	updateUsernames,
	readUsernames
};