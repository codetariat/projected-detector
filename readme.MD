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

let realValue = projected.isProjected(27345567, 5000) // assetId, suppliedRAP are mandatory parameters
if(realValue){
    console.log(`This egg is projected. Its true suspected value is ${realValue}`)
}

/* 
    output => This egg is projected. Its true suspected value is 1000
    (or something similar to 1000) 
*/
```

## Gist

The gist can be found [here](https://gist.githubusercontent.com/codetariat/929307be574de178428d8e3d6710c382/raw).