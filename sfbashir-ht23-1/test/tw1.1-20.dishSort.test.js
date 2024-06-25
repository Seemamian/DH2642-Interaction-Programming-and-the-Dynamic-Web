import dishesConst from './dishesConst.js';
import { assert, expect, should } from 'chai';

const utilities= await import(`../src/${TEST_PREFIX}utilities.js`);

describe("TW1.1 sortDishes", function tw1_1_20() {
    this.timeout(200000);  // increase to allow debugging during the test run
    before(function tw1_1_20_before(){
        if(!utilities || !utilities.sortDishes)
            this.skip();
    });
    
    it("sort order should be: 'no type', starter, main course, dessert (export sortDishes to enable)", function  tw1_1_20_2(){
        this._runnable.title="sort order should be: 'no type', starter, main course, dessert";
        const {sortDishes}= utilities;
        
        const array= [dishesConst[4], dishesConst[6], dishesConst[2], dishesConst[7]];  
        const sorted= sortDishes(array);
        expect(sorted, "sortDishes should return an array").to.be.an("array");

        let wasReverse=true;
        try{
            expect(sorted).to.deep.equal([array[1], array[0], array[2], array[3]]);
        }catch(e){ wasReverse=false;}
        if(wasReverse)
            assert.fail("Your sort is almost correct but in reverse. Consider reversing the logic of your sort() callback");
        

        assert.equal(sorted.length, 4, "sorted array should have same length as array provided");
        assert.equal(sorted[0], array[3], "no type should be first");
        assert.equal(sorted[1], array[2], "starter should be second");
        assert.equal(sorted[2], array[0], "main course should be third");
        assert.equal(sorted[3], array[1], "dessert should be fourth");
    });
    
    it("sorted array should not be the same object as original array. Use e.g. spread syntax [...array]", function tw1_1_20_1(){
        const {sortDishes}= utilities;
        
        const array= [dishesConst[4], dishesConst[6], dishesConst[2], dishesConst[7]];
        const arrayCopy=[...array];
        const sorted= sortDishes(array);
        expect(sorted, "sortDishes should return an array").to.be.an("array");
        
        expect(sorted, "sorted array should create a copy").to.not.equal(array);
        array.forEach(function tw1_1_20_1_checkDishCB(dish, index){
            expect(dish).to.equal(
                arrayCopy[index],
                "do not sort the original array, copy/spread the array, then sort the copy");
        });
    });

});
