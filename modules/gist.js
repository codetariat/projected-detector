'use strict';
import dotenv from 'dotenv'
dotenv.config();

import GitHub from 'github-base'
const github = new GitHub({ token: process.env.GITHUB_TOKEN});
const gist_id = '929307be574de178428d8e3d6710c382'

import fetch from 'node-fetch'

const gist = {}

gist.push = async function(input){
	let options = { files: { 'projecteds.json': { content: input } } }
	github.patch('/gists/' + gist_id, options)
	.then(res => {

	}).catch(console.error)
}

gist.get = async function(){
    return await fetch(`https://gist.githubusercontent.com/codetariat/${gist_id}/raw`).then(r => r.json())
}

export default gist