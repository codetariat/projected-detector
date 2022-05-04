/*

// Example request to scrape best price and sales volume data from rolimons:

let id = 6803410579
let res = await fetch(`https://www.rolimons.com/item/${id}`).then(r=>r.text())

let bestPricesUnprocessed = res.substr(res.indexOf(`"best_price":[`) + (`"best_price":`).length)
let bestPrices = JSON.parse(bestPricesUnprocessed.substr(0, bestPricesUnprocessed.indexOf(`]`)+1))
console.log(bestPrices)

let salesDatesUnprocessed = res.substr(res.indexOf(`"timestamp":[`) + (`"timestamp":`).length)
let salesDates = JSON.parse(salesDatesUnprocessed.substr(0, salesDatesUnprocessed.indexOf(`]`)+1))
console.log(salesDates)

let salesVolumeUnprocessed = res.substr(res.indexOf(`"sales_volume":[`) + (`"sales_volume":`).length)
let salesVolume = JSON.parse(salesVolumeUnprocessed.substr(0, salesVolumeUnprocessed.indexOf(`]`)+1))
console.log(salesVolume)

let salesData = {}

for(let k in salesDates){
    salesData[salesDates[k]] = salesVolume[k]
}

console.log(salesData)

*/

import gist from './modules/gist.js'