import dishesConst from './dishesConst.js';
import { assert, expect, should } from 'chai';
const utils= await import(`../src/${TEST_PREFIX}utilities.js`);
const {isKnownTypeCB, dishType}=utils;

describe("TW1.1 dishType", function tw1_1_10() {
    this.parent.setMaxListeners(200); // prevent EventEmitter "too many listeners" warning

    this.timeout(200000);  // increase to allow debugging during the test run

    before(function tw1_1_10_before(){
        if(!utils || !isKnownTypeCB || !dishType)
            this.skip();
    });

    it("isKnownTypeCB recognizes only starter, main course, dessert (export isKnownTypeCB and dishType to enable)", function tw1_1_10_1(){
        this._runnable.title= "isKnownTypeCB recognizes only starter, main course, dessert";
        expect(isKnownTypeCB("starter"), "starter is a known type, so we should return truthy").to.be.ok;
        expect(isKnownTypeCB("main course"), "main course is a known type, so we should return truthy").to.be.ok;
        expect(isKnownTypeCB("dessert"), "dessert is a known type, so we should return truthy").to.be.ok;
        expect(isKnownTypeCB("appetizer"), "appetizer is not a known type, so we should return falsy").to.not.be.ok;
    });
    
    it("dishType returns a known dish type", function tw1_1_10_2(){ expect(dishType(dishesConst[4])).to.equal("main course");});
    //    it("should recognize starter in first position", function(){ return assert.equal(dishType(dishesConst[1]), "starter");});
    //    it("should recognize starter in other position", function(){ return assert.equal(dishType(dishesConst[2]), "starter");});
    //    it("should recognize dessert in first position", function(){ return assert.equal(dishType(dishesConst[6]), "dessert");});
    //    it("should recognize dessert in other position", function(){ return assert.equal(dishType(dishesConst[5]), "dessert");});
    it("dishType returns empty string if starter, main course, dessert not present", function tw1_1_10_3(){ expect(dishType(dishesConst[0])).to.equal("");});
    it("dishType returns empty string if dishTypes property not present", function  tw1_1_10_4(){ expect(dishType(dishesConst[7])).to.equal("");});
});

