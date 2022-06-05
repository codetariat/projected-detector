'use strict';
import dotenv from 'dotenv'
import GitHub from 'github-base'
import fetch from 'node-fetch'

dotenv.config();
const github = new GitHub({ token: process.env.GITHUB_TOKEN});
const gist_id = '929307be574de178428d8e3d6710c382'

const gist = {}

gist.push = async function(input){
	let options = { files: { 'projecteds.json': { content: JSON.stringify(input, null, 3) } } }
	github.patch('/gists/' + gist_id, options).catch(e => {console.trace(`CAUGHT ERROR: ${e}`)})
}

gist.get = async function(){
    return await fetch(`https://gist.githubusercontent.com/codetariat/${gist_id}/raw`).then(r => r.json())
}

export default gist