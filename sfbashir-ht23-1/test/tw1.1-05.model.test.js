import { assert, expect, should } from 'chai';
import dishesConst from './dishesConst.js';
import cloneModel from "./cloneModel.js";

function getDishConst(x){ return dishesConst.find(function(d){ return d.id===x;});}

describe("TW1.1 Dinner Model (applcation state)", function tw1_1_05() {
    this.parent.setMaxListeners(200); // prevent EventEmitter "too many listeners" warning
    this.timeout(200000);  // increase to allow debugging during the test run
    let model;
    
    beforeEach(async function  tw1_1_05_beforeEach() {
        const modelTemplate= cloneModel((await import(`../src/${TEST_PREFIX}DinnerModel.js`)).default);
        
        try{
            model= cloneModel(modelTemplate);
        }catch(e){
            console.error(e);
        }
    });
    
    it("number of guests can only be set to a positive integer", function  tw1_1_05_1(){
        expect(model, "Model could not be imported, please check the top of your Console!").to.be.ok;
        // we try to set number of guests with various values, then read the model to check that the value is there
        expect(model.numberOfGuests, " number of guests not properly initialized").to.equal(2);
        expect(model.dishes, "dishes  not properly initialized to empty array").to.be.an("array");
        expect(model.dishes.length, "dishes  not properly initialized to empty array").to.equal(0);
        
        model.setNumberOfGuests(1);
        expect(model.numberOfGuests, "The model numberOfGuests must be set to 1 if setNumberOfGuests(1) is called").to.equal(1);
        model.setNumberOfGuests(2);
        expect(model.numberOfGuests, "The model numberOfGuests must be set to 2 if setNumberOfGuests(2) is called").to.equal(2);

        const msg= "number of guests not a positive integer";        

        // now we try a few illegal number-of-guests values. They should throw an Error.
        // the way to do that in Mocha is to define a CB that should throw, and pass it to expect()
        function tw1_1_05_1_throw1CB(){ model.setNumberOfGuests(-1); }
        function tw1_1_05_1_throw2CB(){ model.setNumberOfGuests(0); }
        function tw1_1_05_1_throw3CB(){ model.setNumberOfGuests(3.14159265); }
        
        expect(tw1_1_05_1_throw1CB, "The model should not allow a negative number of guests, Error must be thrown").to.throw(Error, msg);
        expect(tw1_1_05_1_throw2CB, "The model should not allow 0 guests, Error must be thrown").to.throw(Error, msg);
        expect(tw1_1_05_1_throw3CB,"The model should not allow a non-integer number of guests, Error must be thrown").to.throw(Error, msg);
    });

    it("can add dishes", function  tw1_1_05_1_5(){
        // addToMenu is initially implemented but you may break it when you change the model, so here is a test to help you detect that
        // we add a few dishes and check the length after each
        model.addToMenu(getDishConst(100));
        expect(model.dishes.length, "After adding 1 dishe to the model via addToMenu, model.dishes should have length 1").to.equal(1);
        model.addToMenu(getDishConst(1));
        expect(model.dishes.length, "After adding 2 dishe to the model via addToMenu, model.dishes should have length 2").to.equal(2);
        model.addToMenu(getDishConst(200));
        expect(model.dishes.length, "After adding 3 dishes to the model via addToMenu, the model should have 3 dishes").to.equal(3);

        // now we check that each dish is in the menu!
        expect(model.dishes, "inserted dish with ID 1 expected to be in the menu").to.include(getDishConst(1));
        expect(model.dishes, "inserted dish with ID 100 expected to be in the menu").to.include(getDishConst(100));
        expect(model.dishes, "inserted dish with ID 200 expected to be in the menu").to.include(getDishConst(200));
    });
    it("can remove dishes", function  tw1_1_05_2(){
        // we force a few dishes in the menu, then try to remove one
        model.dishes=[getDishConst(100), getDishConst(1), getDishConst(200)];        
        model.removeFromMenu({id:1});        
        expect(model.dishes.length, "after removing a dish from a menu with 3 dishes, length of dishes expcted to be 2").to.equal(2);

        // should now be removed
        expect(model.dishes, "The model properly removes dish when given {id:1} as an argument").to.not.include(getDishConst(1));
        expect(model.dishes, "inserted dish with ID 100 expected to be in the menu after another dish was removed").to.include(getDishConst(100));
        expect(model.dishes, "inserted dish with ID 200 expected to be in the menu after another dish was removed").to.include(getDishConst(200));
        
        // remove non-existing dish
        model.removeFromMenu({id:256});
        expect(model.dishes.length, "The model should not remove dishes that do not exist").to.equal(2);
        expect(model.dishes, "inserted dish with ID 100 expected to be in the menu").to.include(getDishConst(100));
        expect(model.dishes, "inserted dish with ID 200 expected to be in the menu").to.include(getDishConst(200));
    });

    it("can set current dish", function  tw1_1_05_3(){
        expect(model.currentDish, "currentDish expected to be initially null").to.be.null;

        // later on, setCurrentDish will make a network access (fetch). We need to simulate that.
        const oldFetch= fetch;
        window.fetch= function tw1_1_05_3_fetch(){
            return Promise.resolve({
                ok:true,
                status:200,
                json(){
                    return Promise.resolve(dishesConst[0]);
                }
            });
        };
        try{
            // now we set different values to the current dish, and check it in the model
            model.setCurrentDish(1);
            expect(model.currentDish, "expected current dish to be 1 after having set it to 1").to.equal(1);
            
            model.setCurrentDish(3);
            expect(model.currentDish, "expected current dish to be 3 after having set it to 3").to.equal(3);
        }finally{
            window.fetch=oldFetch;
        }
    });
});
