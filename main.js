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
console.log(projectedData)

// Get rolimons itemTable array
let itemTable = await rolimons.getItemTable();

async function determineTrueValue(assetId) {
    // Check if item has a value in itemTable
    if (itemTable[assetId].value) {
        return {
            assetName: itemTable[assetId].name,
            trueValue: itemTable[assetId].value,
            maxDeviation: -1,
        }
    }
    // Get historic data from rolimons graphs for item based on assetId
    let historicData = await rolimons.getHistoricDataFromItem(assetId);

    // Check if it sells often (15 unique days, 30 sales in last month)
    let sellsOften = historicData.uniqueSaleDaysInLastMonth > 15 && historicData.salesInLastMonth > 30;

    // Cut off periods in historicData.rapHistoryData that are likely projected
    historicData.rapHistoryData = util.cutOffLikelyProjectedPeriods(historicData.bestPriceData, historicData.rapHistoryData);

    // Get only last 180 days worth of data except if sellsOften is true then it's 30
    let days = (!sellsOften && 180) || 30

    // Splice all elements from 30/180 days ago, truncate it, then get average
    let suspectedValueBasedOnBestPriceHistory = Math.round(util.truncatedSplicedAverage(historicData.bestPriceData, days));
    let suspectedValueBasedOnRapHistory = Math.round(util.truncatedSplicedAverage(historicData.rapHistoryData, days));
    let suspectedValueBasedOnSales = Math.round(util.truncatedSplicedAverage(historicData.salesData, days))

    // Get lowest of the three and declare that the trueValue unless one of them is equal to zero
    if (suspectedValueBasedOnSales == 0) { // Account for glitched graphs
        suspectedValueBasedOnSales = suspectedValueBasedOnRapHistory;
    }

    let trueValue = Math.min(suspectedValueBasedOnBestPriceHistory, suspectedValueBasedOnRapHistory)
    trueValue = Math.min(trueValue, suspectedValueBasedOnSales)

    // Calculate max deviation allowed
    // 1.075 for smallest item (1000 RAP), 1.3 for bigger items (5000 RAP)
    let smallestDev = {
        x: 1000,
        y: 1.075
    };
    let biggestDev = {
        x: 5000,
        y: 1.25
    };
    let m = (biggestDev.y - smallestDev.y) / (biggestDev.x - smallestDev.x)
    let maxDeviation = m * (trueValue - smallestDev.x) + smallestDev.y
    maxDeviation = Math.max(maxDeviation, smallestDev.y)
    maxDeviation = Math.min(maxDeviation, biggestDev.y)

    // Multiplier: 1 for most sold item (30 uniqueSaleDaysInLastMonth), 1.3 for less sold item (1 uniqueSaleDaysInLastMonth
    let smallestMult = {
        x: 30,
        y: 1
    };
    let biggestMult = {
        x: 1,
        y: 1.3
    };
    let m2 = (biggestMult.y - smallestMult.y) / (biggestMult.x - smallestMult.x)
    let multiplier = m2 * (historicData.uniqueSaleDaysInLastMonth - smallestMult.x) + smallestMult.y
    multiplier = Math.max(multiplier, smallestMult.y)
    multiplier = Math.min(multiplier, biggestMult.y)

    maxDeviation = Math.round(maxDeviation * multiplier * 100) / 100

    // If defaultValue is bigger than trueValue * maxDeviation then it's proj
    let projected = itemTable[assetId].defaultValue > trueValue * maxDeviation

    // ========= =================== ========
    // ========= console.log factory ========
    let title = `============ item: ${itemTable[assetId].name} ============`
    console.log(title)
    console.log(`trueValue = ${trueValue}`)
    console.log(`lastRecordedRap = ${itemTable[assetId].defaultValue}`)
    console.log(`maxDeviation = ${maxDeviation}`)
    console.log(`projected = ${projected}`)
    console.log(`suspectedValueBasedOnBestPriceHistory = ${suspectedValueBasedOnBestPriceHistory}`)
    console.log(`suspectedValueBasedOnRapHistory = ${suspectedValueBasedOnRapHistory}`)
    console.log(`suspectedValueBasedOnSales = ${suspectedValueBasedOnSales}`)
    console.log(`uniqueSaleDaysInLastMonth = ${historicData.uniqueSaleDaysInLastMonth}`)
    console.log(`salesInLastMonth = ${historicData.salesInLastMonth}`)
    console.log(`=`.repeat(title.length))
    // ========= =================== ========
    // ========= =================== ========

    return {
        assetName: itemTable[assetId].name,
        trueValue,
        maxDeviation
    }
}

async function main() {
    // If counter doesn't exist, initialise it with 0
    projectedData.counter = projectedData.counter || 0;

    // Index for the for-loop
    let index = 0;

    // Loop through the itemTable
    for (let assetId in itemTable) {
        index++;
        // If index is smaller than the counter, continue
        if (index <= projectedData.counter) {
            continue
        }

        // Determine if given item is projected or not
        let itemData = await determineTrueValue(assetId)
        projectedData[assetId] = itemData

        // Stop looping if we've gone 5 items over counter (ie if index-5 >= counter)
        if (index - 5 >= projectedData.counter) {
            break
        }
    }

    // Save to gist
    projectedData.counter = index;

    // if counter >= itemTable.length then reset counter to 0
    if (projectedData.counter >= Object.keys(itemTable).length) {
        projectedData.counter = 0;
    }

    await gist.push(projectedData)
}

// Check if argument was passed
let argument = process.argv[2]

if (argument) {
    determineTrueValue(argument)
} else {
    main();
}