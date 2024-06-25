import { assert, expect } from "chai";

import {withMyFetch, myDetailsFetch, dishInformation} from "./mockFetch.js";
import {findPersistencePropNames, state, initDB} from "./mockFirebase.js";
import getModule from "./filesToTest.js";

const X = TEST_PREFIX;
const firebaseModel= await getModule(`/src/${X}firebaseModel.js`);
const DinnerModel= await getModule(`/src/${X}DinnerModel.js`).default;

describe("TW3.5 Firebase-model", function tw3_5_10() {
    this.timeout(200000); // increase to allow debugging during the test run
    
    before(function tw3_5_10_before() {
        if (!firebaseModel) this.skip(); // should not happen, firebaseModel.js is defined by default
        if (!firebaseModel.modelToPersistence) this.skip();
    });

    it("modelToPersistence", function tw3_5_10_1(){
        initDB();
    });

    it("saveToFirebase persists the result of modelToPersistence _only_ if model.ready is truthy", async function tw_3_5_10_2(){
	if(!firebaseModel.saveToFirebase)
	    this.skip();
        const {numberOfGuests, dishes, currentDish}=findPersistencePropNames();
        const model= {setNumberOfGuests(g){this.numberOfGuests=g;}, setCurrentDish(d){this.currentDish=d;},
                      numberOfGuests:5, dishes:[{id:24}, {id:42}], currentDish:24, ready:true};
        state.setHistory=[];
        firebaseModel.saveToFirebase(model);
        expect(state.setHistory.length, "saveToFirebase performs a firebase set() operation").to.equal(1);
        expect(state.setHistory[0].val, "data saved to firebase is the one from the model (via modelToPersistence)" ).to.eql({
            [numberOfGuests]:5,
            [dishes]:[24, 42],
            [currentDish]: 24
        });

        model.ready=false;
        state.setHistory=[];
        firebaseModel.saveToFirebase(model);
        expect(state.setHistory.length, "if model.ready is false, nothing is set() to firebase").to.equal(0);
    });

    
    it("persistenceToModel", async function tw3_5_10_1(){
	if(!firebaseModel.persistenceToModel)
	    this.skip();
        const {numberOfGuests, dishes, currentDish}=findPersistencePropNames();
        const model=  {
            setNumberOfGuests(g){ this.numberOfGuests= g;},
            setCurrentDish(d){ this.currentDish=d; },
            dishes:[]
        };
        const model2={...model};

        let result;
        await withMyFetch(myDetailsFetch, async function(){
            return firebaseModel.persistenceToModel( {
                [numberOfGuests]:32,
                [dishes]:[49, 42],
                [currentDish]:22
            },model).then?.(x=> result="returned");
        });
        expect(model.currentDish, "the current dish set in the model should be the same as in the cloud").to.equal(22);
        expect(model.numberOfGuests, "the number of guests set in the model should be the same as in the cloud").to.equal(32);
        expect(model.dishes).to.be.an("array");
        expect(model.dishes.map(d=>d.id).sort(), "the dishes set in the model should be retrieved from the API based on the IDs from the cloud").to.eql([42, 49]);
        expect(myDetailsFetch.lastFetch, "persistenceToModel should call getMenuDetails, passing the given dish IDs").to.include("49");
        expect(myDetailsFetch.lastFetch, "persistenceToModel should call getMenuDetails, passing the given dish IDs").to.include("42");
        expect(result, "persistenceToModel should return a promise, so the caller can wait for all dishes to be retrieved").to.be.ok;

        let result2;
        await withMyFetch(myDetailsFetch, async function(){
            return firebaseModel.persistenceToModel(null, model2).then?.(x=> result2= "returned");
        });
        expect(model2.currentDish, "if there is no data in the cloud, currentDish should be set to null or not defined").to.not.be.ok;
        expect(model2.numberOfGuests, "if there is no data in the cloud, number of guests should be set to 2").to.equal(2);
        expect(model2.dishes.map(d=>d.id),  "if there is no data in the cloud, the model dishes should be set to an empty array").to.eql([]);
        expect(result2, "persistenceToModel should still return a promise even when there are no dish IDs in the cloud").to.be.ok;
    });

    it("readFromFirebase passes get() result to persistenceToModel and waits for it to resolve. Set model.ready to false during this process!", async function tw3_5_10_3(){
	if(!firebaseModel.readFromFirebase)
	    this.skip();
        state.getHistory=[];
        const {numberOfGuests, dishes, currentDish}=findPersistencePropNames();
        
        state.data={
            [numberOfGuests]:13,
            [dishes]:[ 45, 42, 22],
            [currentDish]: 42
        };
        const model= { setNumberOfGuests(g){this.numberOfGuests=g;}, setCurrentDish(d){this.currentDish=d;}, dishes:[], ready:true};
        let rdy;
        await withMyFetch(myDetailsFetch, async function(){
            const p= firebaseModel.readFromFirebase(model);
            rdy= model.ready;
            await p;
        });
	checkSave("readFromFirebase ", model, rdy, {numberOfGuests, dishes, currentDish});
        state.setHistory=[];
        firebaseModel.saveToFirebase({numberOfGuests:2, ready:true, dishes:[]});
        expect(state.getHistory[0].ref, "saveToFirebase and readFromFirebase use the same REF").to.eql(state.setHistory[0].ref);
    });

    function checkSave(explain, model, rdy, {numberOfGuests, dishes, currentDish}) {
        expect(rdy, explain+" should set model.ready to false before attempting a get()").to.equal(false);
        expect(state.getHistory.length, explain+" makes a get() call").to.equal(1);
        state.data[dishes].forEach(x=>expect(myDetailsFetch.lastFetch, explain+ "readFromFirebase initiates getMenuDetails promise").to.include(x));
        expect(model.numberOfGuests, explain+ "sets data from firebase get() into the model (nr. guests)").to.equal(state.data[numberOfGuests]);
        expect(model.currentDish, explain+"sets data from firebase get() into the model (current dish)").to.equal(state.data[currentDish]);
        expect(model.dishes, explain + ": when readFromFirebase resolves, model dishes should be an array").to.be.an("array");
        expect(model.dishes?.map(d=>d.id), explain+": when readFromFirebase resolves, dishes retrieved via getMenuDetails() should be set into the model. Did you  await the promise returned by persistenceToModel?").to.eql(state.data[dishes]);
        expect(model.ready, explain+ ": when readFromFirebase resolves, model.ready is set to true").to.equal(true);
	
    }
    
    it("connectToFirebase (default firebaseModel export)", async function tw3_5_10_6(){
	if(!firebaseModel.default)
	    this.skip();
        state.getHistory=[];
        const {numberOfGuests, dishes, currentDish}=findPersistencePropNames();
        
        state.data={
            [numberOfGuests]:11,
            [dishes]:[ 45, 42, 22],
            [currentDish]: 22
        };
        const model= { setNumberOfGuests(g){this.numberOfGuests=g;}, setCurrentDish(d){this.currentDish=d;}, dishes:[], ready:true};
        let rdy;
	let check, save;
        await withMyFetch(myDetailsFetch, async function(){
            firebaseModel.default(model, function(acb1, acb2) { check=acb1; save= acb2;});
            rdy= model.ready;
	    await myDetailsFetch.lastFetch;
        });

	checkSave("connectToFirebase calls saveToFirebase; ", model, rdy, {numberOfGuests, dishes, currentDish});

	expect(check, "first side effect argument must be a function (callback)").to.be.a('function');
	expect(save, "second side effect argument must be a function (callback)").to.be.a('function');
	
	const base= check();
	expect(base).to.be.ok;

	const defined= "the first ACB passed to the side effect should always return a defined value";
	model.numberOfGuests= 12;
	const base_guests= check();
	
	expect(base_guests, defined).to.be.ok;

	model.dishes= model.dishes.slice(1);
	const base_dishes= check();
	expect(base_dishes, defined).to.be.ok;

	model.currentDish= 42;
	const base_current= check();
	expect(base_current, defined).to.be.ok;

	const different= "the first ACB passed to the side effect should return a different object/array whenever there is a change in model nr guests, dish array or currentDish";
	expect(base, different).to.not.deep.equal(base_guests);
	expect(base, different).to.not.deep.equal(base_dishes);
	expect(base, different).to.not.deep.equal(base_current);
	expect(base_guests, different).to.not.deep.equal(base_dishes);
	expect(base_guests, different).to.not.deep.equal(base_current);
	expect(base_dishes, different).to.not.deep.equal(base_current);

	state.setHistory=[];
	save();
        expect(state.setHistory.length, "second ACB passed to the side effect calls saveToFirebase, which performs a firebase set() operation").to.equal(1);

        expect(state.setHistory[0].val, "second ACB passed to the side effect calls saveToFirebase: data saved to firebase is the one from the model (via modelToPersistence)" ).to.eql({
	    // these are the results of the model changes above ^
            [numberOfGuests]:12,   
            [dishes]:[22, 42],
            [currentDish]: 42
        });

        model.ready=false;
        state.setHistory=[];
	save();
        expect(state.setHistory.length, "second ACB passed to the side effect calls saveToFirebase: if model.ready is false, nothing is set() to firebase").to.equal(0);

	
    });

    it("live update (optional): readFromFirebase invokes onValue() to copy cloud data into the model", async function tw3_5_10_3(){
        state.onHistory=[];
        state.getHistory=[];
        const model={setNumberOfGuests(g){this.numberOfGuests=g;}, setCurrentDish(d){this.currentDish=d;}};
        await withMyFetch(myDetailsFetch, async function(){
            await firebaseModel.readFromFirebase(model);
        });
        if(!state.onHistory.length)
            this.skip();
        const {numberOfGuests, dishes, currentDish}=findPersistencePropNames();
        const acb= state.onHistory[0].acb;
        expect(acb, "a callback is passed to onValue()").to.be.a("function");
        expect(state.getHistory[0].ref, "get() and onState() are performed on the same REF").to.eql(state.onHistory[0].ref);
        const data= {
                [numberOfGuests]:15,
                [dishes]:[ 45, 42, 21],
                [currentDish]: 42
        };
        await withMyFetch(myDetailsFetch, function(){
            acb({
                val(){ return data; }
            });
        });

        data[dishes].forEach(x=>expect(myDetailsFetch.lastFetch, "firebase promise chain initiates getMenuDetails promise").to.include(x));
   
        expect(model.numberOfGuests, "data from firebase onValue() is set into the model (nr. guests)").to.equal(data[numberOfGuests]);
        expect(model.currentDish, "data from firebase onValue() is set into the model (current dish)").to.equal(data[currentDish]);
        expect(model.dishes.map(d=>d.id), "dihes with the IDs from firebase onValue() are retrieved via getMenuDetails and set into the model").to.eql(data[dishes]);
    });
});





