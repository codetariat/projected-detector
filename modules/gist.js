require('dotenv').config()
const GitHub = require('github-base');
const github = new GitHub({ token: process.env.GITHUB_TOKEN});
const gist_id = '929307be574de178428d8e3d6710c382'

exports.push = async function(input){

}