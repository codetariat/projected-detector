[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/codetariat/projected-detector.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/codetariat/projected-detector/context:javascript)

# Codet's Projected Detector

This is my effort to create a maintained and accurate projected detector for Roblox through gist. It uses data from Rolimon's and Roblox's own sales chart in order to find the true value for an item. It takes about ~66 hours (a little over 2.5 days) for the entire list to be updated.

## Status

This is still in early development and has to be used very cautiously.

## Format

The format is a JSON inside a raw gist file. The JSON also contains a function called isProjected which will either return false or the trueValue in case an item is projected. Because I'm unable to include up-to-date RAP in the gist, it's mandatory to supply the rap in the .isProjected() function.

## Support

Please consider contributing to the code to improve it and make it more usable for other people in their projects as well.

## Example usage (JavaScript)

```javascript
// source for isProjected function: ./modules/isProjected.js
// https://raw.githubusercontent.com/codetariat/projected-detector/main/modules/isProjected.js
const isProjected = function(assetId, suppliedRap){
    if(isNaN(assetId)){
        console.trace(`ERROR: expected assetId (1st param of .isProjected) to be a number, got ${assetId}.`)
    }

    if(isNaN(suppliedRap)){
        console.trace(`ERROR: expected suppliedRap (2nd param of .isProjected) to be a number, got ${suppliedRap}. suppliedRap is mandatory`)
    }

    if(this[assetId].maxDeviation > 0 && suppliedRap > this[assetId].trueValue * this[assetId].maxDeviation){
        return trueValue
    }else{
        return false
    }
}

const projected = await fetch(`https://gist.githubusercontent.com/codetariat/929307be574de178428d8e3d6710c382/raw`)
    .then(res => res.json())

let assetId = 27345567
let trueValue = isProjected(assetId, 5000) // assetId, suppliedRAP are mandatory parameters
if(trueValue){
    console.log(`${projected[assetId].assetName} is projected. Its true suspected value is ${trueValue}.`)
}

/* 
    output => Fiery Egg of Egg Testing is projected. Its true suspected value is 1000
    (or something similar to 1000)

    if you need more data, call: projected[assetId] => { 
        assetName: "Fiery Egg of Egg Testing",
        trueValue: ...,
        maxDeviation: ...,
    }

    projected[assetId].maxDeviation denotes the amount of times an item may be allowed to
    deviate from the trueValue before it's considered projected (e.g 105 means an item is
    allowed to deviate 5% from its trueValue)
*/
```

## Gist containing list of projecteds

The gist can be found [here](https://gist.githubusercontent.com/codetariat/929307be574de178428d8e3d6710c382/raw).