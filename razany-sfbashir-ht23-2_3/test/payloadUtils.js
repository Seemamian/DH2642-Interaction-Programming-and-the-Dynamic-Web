import {withMyFetch, myDetailsFetch, dishInformation} from "./mockFetch.js";
import { assert, expect } from "chai";

const payloads=[];

async function changeGuests(modelTarget, observers, propsHistory, canUpdate){
    propsHistory.length=0;
    modelTarget.ng(6);
    observers.forEach(o=>o(payloads[0]));
    if(propsHistory.length && !canUpdate)
        expect.fail("must not update when numberOfguests changes");
    if(!propsHistory.length && canUpdate)
        expect.fail("must update when numberOfguests changes");
}

async function addDish(modelTarget, observers, propsHistory, canUpdate){
    propsHistory.length=0;
    modelTarget.d([...modelTarget.dishes, {...dishInformation, id:42}]);
    observers.forEach(o=>o(payloads[1]));
    await new Promise(resolve => setTimeout(resolve));
    if(propsHistory.length && !canUpdate)
        expect.fail("must not update when adding a dish");
    if(!propsHistory.length && canUpdate)
        expect.fail("must update when adding a dish");
}
async function removeDish(modelTarget, observers, propsHistory, canUpdate){
    propsHistory.length=0;
    modelTarget.d(modelTarget.dishes.slice(0, -1));
    observers.forEach(o=>o(payloads[payloads.length-1]));
    await new Promise(resolve => setTimeout(resolve));
    if(propsHistory.length && !canUpdate)
        expect.fail("must not update when removing a dish");
    if(!propsHistory.length && canUpdate)
        expect.fail("must update when removing a dish");
}

async function noCurrentDish(modelTarget, observers, propsHistory, canUpdate){
    propsHistory.length=0;
    modelTarget.cd(null);
    observers.forEach(o=>o(payloads[3]));
    await new Promise(resolve => setTimeout(resolve));
    if(propsHistory.length && !canUpdate)
        expect.fail("must not update when changing current dish promise");
    if(!propsHistory.length && canUpdate)
        expect.fail("must update when changing current dish promise");
}
async function changeCurrentDish(modelTarget, observers, propsHistory, canUpdate){
    propsHistory.length=0;
    modelTarget.cd(42);
 /*   const promise=  new Promise(resolve=>setTimeout(resolve("dummy promise result"), 10));
    modelTarget.currentDishPromiseState={promise};
    promise.then(()=>{
        modelTarget.currentDishPromiseState.data={...dishInformation, id:42};       
    })
        .then(()=> new Promise(resolve => setTimeout(resolve)))
        .then(()=>{
            if(propsHistory.length && !canUpdate)
                expect.fail("must not update current dish promise resolves");
            if(!propsHistory.length && canUpdate)
                expect.fail("must update when current dish promise resolves");
        });
 */
    observers.forEach(o=>o(payloads[2]));
    await new Promise(resolve => setTimeout(resolve));
    if(propsHistory.length && !canUpdate)
        expect.fail("must not update when setting current dish");
    if(!propsHistory.length && canUpdate)
        expect.fail("must update when setting current dish"); 
}

async function dummyNotification(modelTarget, observers, propsHistory){
    propsHistory.length=0;
    observers.forEach(o=>o({dummy:"payload"}));
    await new Promise(resolve => setTimeout(resolve));
    if(propsHistory.length){
        expect.fail("must not update on notification with dummy payload");
    }

}
export {changeGuests, addDish, removeDish, changeCurrentDish, noCurrentDish, dummyNotification}
