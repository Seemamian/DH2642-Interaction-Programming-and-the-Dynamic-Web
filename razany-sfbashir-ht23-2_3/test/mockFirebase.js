import { assert, expect } from "chai";
import getModule from "./filesToTest.js";
const X = TEST_PREFIX;

let firebaseModel;

// needs to happen a bit after the module loads, because it depends on this module...
setTimeout(async ()=> firebaseModel= (await getModule(`/src/${X}firebaseModel.js`)));

function findPersistencePropNames(){
    try {
        if(!firebaseModel.modelToPersistence)
            return null;
    } catch (e) { return null; }
    const data= firebaseModel.modelToPersistence({numberOfGuests: 42, dishes:[{id:44}, {id:43}], currentDish:45});
    const dataKeys= Object.keys(data);
    expect(dataKeys.length, "persisted object should have three properties").to.equal(3);
    const guests= dataKeys.find(x=> data[x]==42);
    const current= dataKeys.find(x=> data[x]==45);
    const dishes= dataKeys.find(x=> Array.isArray(data[x]));
    expect(guests  && current && dishes, "a property must exist for each of: number of guests, current dish and dishes").to.be.ok;
    expect(data[dishes], "for each dish only the ID should be incldued in the perissted data").to.include(43);
    expect(data[dishes], "for each dish only the ID should be incldued in the perissted data").to.include(44);
    
    expect(data[dishes], "dish IDs should always be saved in the same order, regardless of the order in the dish arrray").to.eql(firebaseModel.modelToPersistence({numberOfGuests: 42, dishes:[{id:43}, {id:44}], currentDish:45})[dishes]);
    expect(firebaseModel.modelToPersistence({numberOfGuests: 42, dishes:[{id:16}, {id:10},  {id:25},  {id:35},  {id:12}], currentDish:45})[dishes],
           "to avoid usesless persistence changes, dish IDs should always be saved in the same order, regardless of the order in the dish arrray").to.
            eql(firebaseModel.modelToPersistence({numberOfGuests: 42, dishes:[{id:12}, {id:35}, {id:16}, {id:25}, {id:10}], currentDish:45})[dishes]);
    
    return {numberOfGuests: guests, dishes: dishes, currentDish: current};
}

const mockDB={};

function getDatabase(){
    return mockDB;
}

const state={
    refHistory:[],
    getHistory:[],
    setHistory:[],
    onHistory:[],
    data:null,
    onACB:null,
};


function initDB(){    // returns false if initialization fails
    const x= findPersistencePropNames();
    if(!x) return false;
    // we make a best effort to initialize some data
    const {numberOfGuests, dishes, currentDish}= x;
    if(!(numberOfGuests && dishes && currentDish))
        return false;
    state.data={
        [numberOfGuests]:13,
        [dishes]:[ 45, 42, 22],
        [currentDish]: 42
    };
    state.initialized= true;
    return true;
}

    
function ref(db, path){
    state.refHistory.push({db, path});
    return {db, path};
}

function get(rf, acb){
    if(!state.initialized)
        console.warn("mock firebase get() used without initialization");
    state.getHistory.push({ref:rf, acb});
    const ret= {
        val(){ return state.data; }
    };
    if(acb) acb(ret);
    return Promise.resolve(ret);
}

function set(rf, val){
    state.setHistory.push({ref:rf, val});
    state.data= val;
}

function onValue(rf, acb){
    state.onACB= acb;
    state.onHistory.push({ref:rf, acb});
    //acb(state.data);
}

export {getDatabase, ref, get, set, onValue, findPersistencePropNames, initDB, state};

