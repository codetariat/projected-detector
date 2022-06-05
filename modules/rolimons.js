'use strict'
import fetch from 'node-fetch'

const rolimons = {}

rolimons.getItemTable = async function(){
    let resp = await fetch('https://www.rolimons.com/itemtable')
	.then(res=>{
		if(!res.ok){
			console.warn(`Rate limited on Rolimons.`)
			process.exit(1)
		}
		return res
	})
	.then(res=>res.text())
	.then(res=>res.substring(res.indexOf('var item_details = {'), res.length))
	.then(res=>(res.substring(res.indexOf('{'),res.indexOf('};')+1)))
	.then(res=>JSON.parse(res))
	let c = Object.keys(resp)
	
	for(let k in c){
		let x = resp[c[k]]
		resp[c[k]] = {
			'name': x[0],
			'assetType': x[1],
			'originalPrice': x[2],
			'created': new Date(x[3]*1000).toString(),
			'discovered': new Date(x[4]*1000).toString(),
			'bestPrice': x[5],
			'favourites': x[6],
			'resellerCount': x[7],
			'rap': x[8],
			'owners': x[9],
			'premiumOwners': x[10],
			'totalCopies': x[11],
			'deletedCopies': x[12],
			'premiumCopies': x[13],
			'hoardedCopies': x[14],
			'acronym': x[15],
			'value': x[16],
			'demand': ['terrible','low','normal','high','amazing'][x[17]],
			'trend': ['lowering', 'unstable', 'stable', 'raising', 'fluctuating'][x[18]] || 'unset',
			'projected': x[19]==1,
			'hyped': x[20]==1,
			'rare': x[21]==1,
			'defaultValue': x[22],
			'rapBased': x[23]
		}
	}

    rolimons.itemTable = resp;
    return rolimons.itemTable;
}

rolimons.getHistoricDataFromItem = async function(id){
    let res = await fetch(`https://www.rolimons.com/item/${id}`).then(r=>r.text())

	let historyDatesUnprocessed = res.substring(res.indexOf(`var history_data`) + (`var history_data`).length)
    historyDatesUnprocessed = historyDatesUnprocessed.substring(historyDatesUnprocessed.indexOf(`"timestamp":[`) + (`"timestamp":`).length)
    let historyDates = JSON.parse(historyDatesUnprocessed.substring(0, historyDatesUnprocessed.indexOf(`]`)+1))

    let bestPricesUnprocessed = res.substring(res.indexOf(`"best_price":[`) + (`"best_price":`).length)
    let bestPrices = JSON.parse(bestPricesUnprocessed.substring(0, bestPricesUnprocessed.indexOf(`]`)+1))
	let bestPriceData = {}

    let rapHistoryUnprocessed = res.substring(res.indexOf(`"rap":[`) + `"rap":`.length)
    let rapHistory = JSON.parse(rapHistoryUnprocessed.substring(0, rapHistoryUnprocessed.indexOf(`]`)+1))
	let rapHistoryData = {}

    let salesDatesUnprocessed = res.substring(res.indexOf(`var sales_data`) + (`var sales_data`).length)
    salesDatesUnprocessed = salesDatesUnprocessed.substring(salesDatesUnprocessed.indexOf(`"timestamp":[`) + (`"timestamp":`).length)
    let salesDates = JSON.parse(salesDatesUnprocessed.substring(0, salesDatesUnprocessed.indexOf(`]`)+1))

	let salesDataUnprocessed = res.substring(res.indexOf(`var sales_data`) + (`var sales_data`).length)
    salesDataUnprocessed = salesDataUnprocessed.substring(salesDataUnprocessed.indexOf(`"avg_daily_sales_price":[`) + (`"avg_daily_sales_price":`).length)
    let sales = JSON.parse(salesDataUnprocessed.substring(0, salesDataUnprocessed.indexOf(`]`)+1))
	let salesData = {};

    let salesVolumeUnprocessed = res.substring(res.indexOf(`"sales_volume":[`) + (`"sales_volume":`).length)
    let salesVolume = JSON.parse(salesVolumeUnprocessed.substring(0, salesVolumeUnprocessed.indexOf(`]`)+1))

    let saleVolumeData = {};
    let uniqueSaleDaysInLastMonth = 0;
	let salesInLastMonth = 0;

    for(let k in salesDates){
        saleVolumeData[salesDates[k]] = salesVolume[k]
		salesData[salesDates[k]] = sales[k]
        if(salesDates[k] * 1000 > (Date.now() - (1000 * 60 * 60 * 24 * 30))){
            uniqueSaleDaysInLastMonth++;
			salesInLastMonth += salesVolume[k]
        }
    }

	for(let k in historyDates){
		rapHistoryData[historyDates[k]] = rapHistory[k]
		bestPriceData[historyDates[k]] = bestPrices[k]		
	}

	sales.id = 'sales';

    let data = {
        rapHistoryData,
        bestPriceData,
        saleVolumeData,
		salesData,
		salesInLastMonth,
		uniqueSaleDaysInLastMonth
    }

    return data
}

export default rolimons