'use strict'

const maths = {}

maths.truncate = function([...array], keep = .8){
    // Calculate amount to remove
    let amountToRemove = Math.round(array.length * (1 - keep) / 2)

    // If there are no values to remove, return the array
    if(amountToRemove < 1){ return array }

    // Sort and slice array
    array = [...array].sort((a,b)=>a-b)
    array = array.slice(amountToRemove, -amountToRemove)
    return array
}

maths.average = function([...array]){
    // Returns the average given an array of numbers
    let sum = array.reduce((a, b) => a + b, 0);
    let avg = (sum / array.length) || 0;
    return avg
}

export default maths