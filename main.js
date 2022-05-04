/*

// Example request to scrape best price and sales volume data from rolimons:

let id = 6803410579
let res = await fetch(`https://www.rolimons.com/item/${id}`).then(r=>r.text())

let bestPricesUnprocessed = res.substr(res.indexOf(`"best_price":[`) + (`"best_price":`).length)
let bestPrices = JSON.parse(bestPricesUnprocessed.substr(0, bestPricesUnprocessed.indexOf(`]`)+1))
console.log(bestPrices)

let salesDatesUnprocessed = res.substr(res.indexOf(`var sales_data`) + (`var sales_data`).length)
salesDatesUnprocessed = salesDatesUnprocessed.substr(salesDatesUnprocessed.indexOf(`"timestamp":[`) + (`"timestamp":`).length)
let salesDates = JSON.parse(salesDatesUnprocessed.substr(0, salesDatesUnprocessed.indexOf(`]`)+1))
console.log(salesDates)

let salesVolumeUnprocessed = res.substr(res.indexOf(`"sales_volume":[`) + (`"sales_volume":`).length)
let salesVolume = JSON.parse(salesVolumeUnprocessed.substr(0, salesVolumeUnprocessed.indexOf(`]`)+1))
console.log(salesVolume)

let salesData = {};
let uniqueSaleDaysInLastMonth = 0;

for(let k in salesDates){
    salesData[salesDates[k]] = salesVolume[k]
    if(salesDates[k] * 1000 > (Date.now() - (1000 * 60 * 60 * 24 * 30))){
        uniqueSaleDaysInLastMonth++;
    }
}

console.log(salesData)
console.log(`uniqueSaleDaysInLastMonth: ${uniqueSaleDaysInLastMonth}`)

*/

import gist from './modules/gist.js'