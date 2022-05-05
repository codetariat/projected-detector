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

async function determineProjected(item){
    let historicData = await rolimons.getHistoricDataFromItem(item);
}

async function main(){
    // Get array from existing gist
    let savedData = await gist.get();

    // If counter doesn't exist, initialise it with 0
    savedData.counter = savedData.counter || 0;

    // Get rolimons itemTable array
    let itemTable = await rolimons.getItemTable();

    // Index for the for-loop
    let index = 0;

    // Loop through the itemTable
    for(let k in itemTable){
        index++;
        // If index is equal or smaller than the counter, continue
        if(index <= savedData.counter){ continue }

        // Determine if given item is projected or not
        determineProjected(itemTable[k])

        // Stop looping if we've gone 5 items over counter (ie if index-1 >= counter)
        if(index - 5 >= savedData.counter){ break }
    }
}

main();