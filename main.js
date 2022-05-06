/*

Step 1. get and process gist
Step 2. get rolimons itemtable
Step 3. get 5 items
    Step 4. get the suspected value for each
    Step 5. get the allowed deviation for each based on sales volume last month
    Step 6. decide for each if they are projected or not
Step 7. save to gist with a counter

*/

import gist from './modules/gist.js'
import rolimons from './modules/rolimons.js'
import util from './modules/util.js'

// Get existing array from gist
let projectedData = await gist.get();

// Get rolimons itemTable array
let itemTable = await rolimons.getItemTable();

async function determineTrueValue(assetId){
    // Get historic data from rolimons graphs for item based on assetId
    let historicData = await rolimons.getHistoricDataFromItem(assetId);

    // Check if it sells often (15 unique days, 30 sales in last month)
    let sellsOften = historicData.uniqueSaleDaysInLastMonth > 15 && historicData.salesInLastMonth > 30;

    // Get only last 180 days worth of data except if sellsOften is true then it's 30
    let days = (sellsOften && 180) || 30

    // Maybe: remove every non-unique repeating data point too as to only record changes in best price/rap?
    // Splice all elements from 30/180 days ago, truncate it, then get average
    let suspectedValueBasedOnBestPriceHistory = Math.round(util.truncatedSplicedAverage(historicData.bestPriceData, days));
    let suspectedValueBasedOnRapHistory = Math.round(util.truncatedSplicedAverage(historicData.rapHistoryData, days));

    // Determine if item is big
    let big;
    let bigItemTreshold = 10000;

    // Check if data on gist has suspected value (trueValue) and if it does, mark big as true if the suspected value is > bigItemTreshold
    if(projectedData[assetId] && projectedData[assetId].trueValue){
        big = projectedData[assetId].trueValue > bigItemTreshold
    // Else check if suspected value based on price history/rap history is > bigItemTreshold
    }else{
        big = suspectedValueBasedOnBestPriceHistory > bigItemTreshold || suspectedValueBasedOnRapHistory > bigItemTreshold;
    }

    // Get lowest of the two and declare that the trueValue 
    let trueValue = Math.min(suspectedValueBasedOnBestPriceHistory, suspectedValueBasedOnRapHistory)

    // Calculate max deviation allowed
    // 1.05 for smallest item (1000 RAP), 1.15 for bigger items (bigItemTreshold)
    let maxDeviation = 0.0000111111111111 * (trueValue - 1000) + 1.05

    // Max is 1.15
    maxDeviation = Math.round(Math.min(maxDeviation, 1.15) * 100) / 100

    // If defaultValue is bigger than trueValue * maxDeviation then it's proj
    let projected = itemTable[assetId].defaultValue > trueValue * maxDeviation

    // ========= =================== ========
    // ========= console.log factory ========
    let title = `==== item: ${itemTable[assetId].name} ====`
    console.log(title)
    console.log(`salesInLastMonth = ${historicData.salesInLastMonth}`)
    console.log(`uniqueSaleDaysInLastMonth = ${historicData.uniqueSaleDaysInLastMonth}`)
    console.log(`suspectedValueBasedOnBestPriceHistory = ${suspectedValueBasedOnBestPriceHistory}`)
    console.log(`suspectedValueBasedOnRapHistory = ${suspectedValueBasedOnRapHistory}`)
    console.log(`trueValue = ${trueValue}`)
    console.log(`lastRecordedRap = ${itemTable[assetId].defaultValue}`)
    console.log(`maxDeviation = ${maxDeviation}`)
    console.log(`projected = ${projected}`)
    console.log(`=`.repeat(title.length))
    // ========= =================== ========
    // ========= =================== ========

    return {
        trueValue,
        maxDeviation
    }
}

async function main(){
    // If counter doesn't exist, initialise it with 0
    projectedData.counter = projectedData.counter || 0;

    projectedData.isProjected = function(assetId, suppliedRap){
        
    }

    // Index for the for-loop
    let index = 0;

    // Loop through the itemTable
    for(let assetId in itemTable){
        index++;
        // If index is equal or smaller than the counter, continue
        if(index <= projectedData.counter){ continue }

        // Determine if given item is projected or not
        let itemData = await determineProjected(assetId)
        projectedData[assetId] = itemData

        // Stop looping if we've gone 5 items over counter (ie if index-1 >= counter)
        if(index - 5 >= projectedData.counter){ break }
    }

    // Save to gist
    await gist.push(projectedData)
}

let argument = process.argv[2]

if(argument){
    determineTrueValue(argument)
}else{
    main();
}