import dishesConst from './dishesConst.js';
import { assert, expect } from 'chai';
import getModule from "./filesToTest.js";
import testComponent from "./testComponentTL.js";

const X= TEST_PREFIX;
const SummaryView=(await getModule(`/src/views/${X}summaryView.vue`))?.default ||
    (await getModule(`/src/views/${X}summaryView.jsx`))?.default;

const SidebarView=(await getModule(`/src/views/${X}sidebarView.vue`))?.default ||
    (await getModule(`/src/views/${X}sidebarView.jsx`))?.default;


// TODO: here we use the student code, which may be still wrong
const {dishType, menuPrice}= await getModule(`/src/${X}utilities.js`);

describe("TW1.3 Array Rendering and basic CSS", function tw1_3() {
    this.timeout(200000);


    function cssCheckAlignRight(element){
        document.body.appendChild(element);

        const originalDisplay = element.style.display;
        element.style.display = 'block';

        const computedStyle = window.getComputedStyle(element);
        element.style.display = originalDisplay;

        expect(computedStyle.textAlign).to.equal("right", "align quantities to the right using CSS");
        document.body.removeChild(element);
    }

    testComponent(
        {vue: SummaryView},
        [{people:3, ingredients:dishesConst.ingrList1},
        {people:2, ingredients:dishesConst.ingrList2}],
        "SummaryView table content (render table rows to enable) [test UI with Vue](/tw1.2.html)[or React](/tw1.2-react.html)",
        function tw1_3_1(output, propIndex,_, test){
            const lookup = dishesConst.ingrList1.reduce(function(acc, ingr){ return {...acc, [ingr.name]:ingr}; }, {});
            const tableRows = output.queryAllByRole('row');
	    if(!tableRows.length)
		test.skip();
	    test._runnable.title=  "SummaryView table content [test UI with Vue](/tw1.2.html)[or React](/tw1.2-react.html)";
	    expect(tableRows.length, "there should be as many table rows as ingredients, preceded by one header row").to.equal(1+(propIndex?dishesConst.ingrList2.length:dishesConst.ingrList1.length));
            // Going through each row in the table
            [...tableRows].forEach(function(tr, index){
                expect(tr.cells.length, "expecting 4 columns").to.equal(4);
                if(index === 0){
                    // Going through each cell in the row
                    [...tr.cells].forEach(function(cell){
                        expect(cell.tagName, "first row should be th").to.be.equal("TH");
                    });
                }else{
                    // Going through each cell in the row
                    [...tr.cells].forEach(function(cell){
                        expect(cell.tagName, "all rows except first should be td").to.be.equal("TD");
                    });

                    expect(lookup[tr.cells[0].textContent.trim()], "expecting first column to show an ingredient name").to.be.ok;
                    expect(lookup[tr.cells[0].textContent.trim()].aisle).to.equal(tr.cells[1].textContent.trim(), "aisle must be shown in column 2");
                    expect(lookup[tr.cells[0].textContent.trim()].unit).to.equal(tr.cells[3].textContent.trim(), "measurement unit must be shown in last column");
                    expect((lookup[tr.cells[0].textContent.trim()].amount*(propIndex?2:3)).toFixed(2)).to.equal(tr.cells[2].textContent.trim(), "amount must be shown in column 3, multiplied by number of guests");
                    expect(tr.cells[2].textContent.trim()[tr.cells[2].textContent.trim().length-3]).to.equal(".", "amount must be shown with two decimals, use (someExpr).toFixed(2)");
                    
                    cssCheckAlignRight(tr.cells[2]);
                }
            });
        });


    testComponent(
	{vue: SummaryView},
        [{people:3, ingredients:dishesConst.ingrList1},
         {people:2, ingredients:dishesConst.ingrList2}],
        "SummaryView table order (render table rows to enable) [test UI with Vue](/tw1.2.html)[or React](/tw1.2-react.html)",
	function tw1_3_2(output, propIndex , _, test){
	    const rows1= output.queryAllByRole('row');
            const [x,...tableRows] = rows1;
	    if(!x)
		test.skip();
	    test._runnable.title=         "SummaryView table order [test UI with Vue](/tw1.2.html)[or React](/tw1.2-react.html)";
            expect(tableRows.length, "there should be as many table rows as ingredients").to.equal(propIndex?dishesConst.ingrList2.length:dishesConst.ingrList1.length);
            
            tableRows.forEach(function(tr, index){
                if(!index) return;
                const tds = tr.querySelectorAll("td");
                const prevTds = tableRows[index-1].querySelectorAll("td");

                if(tds[1].textContent.trim()===prevTds[1].textContent.trim())
                    assert.operator(tds[0].textContent.trim(), ">=", prevTds[0].textContent.trim(), "when values in the 2nd (Aisle) column are equal, value in the first column (name) must be larger than or equal to value in the row above");
                else
                    assert.operator(tds[1].textContent.trim(), ">", prevTds[1].textContent.trim(), "value in the second (Aisle) column must be larger than or equal to value in the row above");
            });
        });

    const lookup =  dishesConst.dishes1.reduce(function(acc, dish){ return {...acc, [dish.title]:{...dish, type: dishType?.(dish) }}; }, {});

    testComponent({vue: SidebarView},
        [{number:3, dishes:dishesConst.dishes1},
        {number:2, dishes:dishesConst.dishes2}],
        "SidebarView table content [test UI with Vue](/tw1.3.html)[or React](/tw1.3-react.html)",
        function tw1_3_3(output, propIndex){
            const tableRows = output.queryAllByRole('row');
            expect(tableRows.length, "there should be table rows for each dish, plus the row for the totals").to.equal(propIndex?dishesConst.dishes2.length+1:dishesConst.dishes1.length+1);
            [...tableRows].forEach(function(tr, index, arr){
                const tds = tr.cells;
                expect(tds.length).to.equal(4, "dish table must have 4 columns");
                expect(tds[3].textContent.trim()[tds[3].textContent.trim().length-3]).to.equal(".", "price and total must be shown with two decimals, use (someExpr).toFixed(2)");            
                if(index==arr.length-1){
                    expect(tds[3].textContent.trim()).to.equal((menuPrice(propIndex?dishesConst.dishes2:dishesConst.dishes1)*(propIndex?2:3)).toFixed(2), "last row must show total menu price multiplied by number of guests");
                    cssCheckAlignRight(tds[3])
                    return;
                }

                expect(lookup[tds[1].textContent.trim()], "second column must contain a dish name").to.be.ok;
                expect(lookup[tds[1].textContent.trim()].type).to.equal(tds[2].textContent.trim(), "3rd column must show dish type");
                expect((lookup[tds[1].textContent.trim()].pricePerServing*(propIndex?2:3)).toFixed(2)).to.equal(tds[3].textContent.trim(), "last column must show total menu price multiplied by number of guests");
                expect(tds[1].firstElementChild?.tagName, "dish name should be a HTML link (<a>)").to.equal("A");
                expect(tds[1].firstElementChild?.getAttribute("href").startsWith("#"), "dish name HTML link should point to the same page (#) to prevent full page reload").to.equal(true);
            
                cssCheckAlignRight(tds[3]);
            });
        });

    testComponent({vue: SidebarView},
        [{number:3, dishes:dishesConst.dishes3},
        {number:4, dishes:dishesConst.dishes1}],
        "SidebarView table order [test UI with Vue](/tw1.3.html)[or React](/tw1.3-react.html)",
        function tw1_3_4(output, propIndex){
            const [x,...tableRows] = output.queryAllByRole('row');
            expect(tableRows.length, "there should be table rows for each dish, plus the row for the totals").to.equal(propIndex?dishesConst.dishes1.length:dishesConst.dishes3.length);
            
            const knownTypes= ["starter", "main course", "dessert"];
            tableRows.forEach(function(tr, index, arr){
                if(!index)return;
                if(index==arr.length-1) return;
                const tds = tr.querySelectorAll("td");
                const prevTds = tableRows[index-1].querySelectorAll("td");
                assert.operator(knownTypes.indexOf(tds[2].textContent.trim()), ">=", knownTypes.indexOf(prevTds[2].textContent.trim()), "expecting value in 3rd column to be bigger than or equal to the value on the row above");
        });
    });
});
