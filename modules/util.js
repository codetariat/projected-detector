const util = {};

import maths from './maths.js'

util.truncatedSplicedAverage = function(object, keepLastDays, keep = .8){
    // Creates newArray and keeps: 'keepLastDays' amount of days
    let newArray = []
    for(let k in object){
        if(k * 1000 > (Date.now() - (1000 * 60 * 60 * 24 * keepLastDays))){
            newArray[newArray.length] = object[k]
        }
    }

    // Return the obtained average of truncated, numbered newArray
    return maths.average(maths.truncate(newArray, keep));
}

export default util;