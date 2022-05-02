/*

Example request to scrape best price graph from rolimons:

let id = 6803410579
let res = await fetch(`https://www.rolimons.com/item/${id}`).then(r=>r.text())
let a = res.substr(res.indexOf(`"best_price":[`) + (`"best_price":`).length)
let b = JSON.parse(a.substr(0, a.indexOf(`]`)+1))
console.log(b)

*/