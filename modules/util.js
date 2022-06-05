'use strict'
import maths from './maths.js'

const util = {};

util.cutOffLikelyProjectedPeriods = function(bestPrices, rapHistory){
    // Create new object
    let newRapHistory = {}
    
    // Loop through given best prices
    for(let k in bestPrices){
        // Get rap and price of timestamp `k`
        let rap = rapHistory[k]
        let price = bestPrices[k]

        // Compare rap to price
        if(rap > 1.35 * price){ continue }

        newRapHistory[k] = rap
    }

    return newRapHistory
}

util.keepOnlyChangedElements = function(array){
    let newArray = []

    for(let k in array){
        // Get original element at index k
        let originalElement = array[k]

        // Get last element from newArray
        let lastElementFromNewArray = newArray[newArray.length - 1]

        // Check if original element is not equal to the last element from newArray
        // If so, add a new element to the newArray which is equal to originalElement
        if(originalElement != lastElementFromNewArray){
            newArray[newArray.length] = originalElement 
        }
    }

    return newArray
}

util.truncatedSplicedAverage = function(object, keepLastDays, keep = .8){
    // Creates newArray and keeps: 'keepLastDays' amount of days
    let newArray = []
    for(let k in object){
        if(k * 1000 > (Date.now() - (1000 * 60 * 60 * 24 * keepLastDays))){
            newArray[newArray.length] = object[k]
        }
    }

    // Return the obtained average of truncated, numbered and delta-checked newArray
    let avg;

    if(object.id && object.id == 'sales'){
        avg = maths.average(maths.truncate(newArray, keep));
    }else{
        avg = maths.average(util.keepOnlyChangedElements(maths.truncate(newArray, keep)));
    }

    return avg;
}

export default util;