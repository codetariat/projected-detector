require('dotenv').config()
const GitHub = require('github-base');
const github = new GitHub({ token: process.env.GITHUB_TOKEN});
const gist_id = '03043d47689a6ee645366d327b11944c'

exports.push = async function(input){

}