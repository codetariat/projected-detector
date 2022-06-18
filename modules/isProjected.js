'use strict';

const module = {};

module.isProjected = function(assetId, suppliedRap){
    if(isNaN(assetId)){console.trace(`ERROR: expected assetId (1st param of .isProjected) to be a number, got ${assetId}.`) }

    if(isNaN(suppliedRap)){ console.trace(`ERROR: expected suppliedRap (2nd param of .isProjected) to be a number, got ${suppliedRap}.`) }

    if(!(this[assetId])){ console.trace(`ERROR: expected this[assetId], got ${this[assetId]}.`) }

    if(this[assetId].maxDeviation > 0 && suppliedRap > this[assetId].trueValue * this[assetId].maxDeviation){
        return this[assetId].trueValue
    }else{
        return false
    }
}

export default module