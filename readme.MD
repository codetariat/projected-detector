# Codet's Projected Detector

This is my effort to create a maintained and accurate projected detector for Roblox through gist. It uses data from Rolimon's and Roblox's own sales chart in order to find the true value for an item.

## Status

This is still in early development and has to be used very cautiously.

## Format

The format is a JSON inside a raw gist file. The JSON also contains a function called isProjected which will either return false or the trueValue in case an item is projected. Because I'm unable to include up-to-date RAP in the gist, you have to supply the rap in the function.

## Support

Please consider contributing to the code to improve it and make it more usable for other people in their projects as well.

## Example usage

```javascript
let projected = await fetch(`https://gist.githubusercontent.com/codetariat/929307be574de178428d8e3d6710c382/raw`)
    .then(res => res.json())

let assetId = 27345567
let trueValue = projected.isProjected(assetId, 5000) // assetId, suppliedRAP are mandatory parameters
if(trueValue){
    console.log(`${projected[assetId].assetName} is projected. Its true suspected value is ${trueValue}`)
}

/* 
    output => Fiery Egg of Egg Testing is projected. Its true suspected value is 1000
    (or something similar to 1000)

    if you need more data, call: projected[assetId] => { 
        assetName: "Fiery Egg of Egg Testing",
        trueValue: ...,
        maxDeviation: ...,
    }

    projected[assetId].maxDeviation denotes the amount of times an item may be allowed to deviate from the trueValue before it's considered projected (e.g 105 means an item is allowed to deviate 5% from its trueValue)
*/
```

## Gist

The gist can be found [here](https://gist.githubusercontent.com/codetariat/929307be574de178428d8e3d6710c382/raw).