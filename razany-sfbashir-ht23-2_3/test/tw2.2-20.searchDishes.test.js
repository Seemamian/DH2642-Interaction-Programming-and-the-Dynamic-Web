import { assert, expect } from "chai";
import {withMyFetch, checkFetchUrl, mySearchFetch, searchResults} from "./mockFetch.js";
//import { server } from "./mocks/testServer.js";

import getModule from "./filesToTest.js";
const X= TEST_PREFIX;
const dishSource= await getModule(`/src/${X}dishSource.js`);

let searchDishes;
if (dishSource?.searchDishes) searchDishes = dishSource.searchDishes;
else searchDishes = dishSource?.default.searchDishes;

describe("TW2.2 API call: search [test](/tw2.2.1.html)", function tw2_2_20() {
  this.timeout(200000);

  before(function tw2_2_20_before() {
    if (!searchDishes) this.skip();
  });

  // this.beforeAll(() => server.listen());
  // this.afterAll(() => server.close());
  // this.afterEach(() => server.resetHandlers());

  // it("searchDishes pizza as main course with mws", async () => {
  //   searchDishes({ query: "pizza", type: "main course" })
  // });

  function testPromise(text, p, searchq) {
      it(text, async function tw2_2_20_testPromise() {
          const result= await withMyFetch(mySearchFetch, p);
          expect(result, "searchDishes transforms the API result to an array").to.be.an('array');

          // the search results returned are dummy. 
          expect(result, "searchDishes transform the promise result into an array of dishes").to.deep.equal(searchResults);

          checkFetchUrl(mySearchFetch.lastFetch, mySearchFetch.lastParam,
                        //-1027221439
                        [-281827937]
                        , searchq);
          

      }).timeout(4000);
  }
    testPromise("searchDishes pizza as main course",
                function tw2_2_20_testPromise1(){return searchDishes({ query: "pizza", type: "main course" });},
                [-1894851277, 1758563338]
               );
    testPromise("searches main course",
                function tw2_2_20_testPromise1(){return searchDishes({ type: "main course" });},
                [1758563338]
               );
    testPromise("searchDishes strawberry pie as dessert",
                function tw2_2_20_testPromise1(){return searchDishes({ query: "strawberry pie", type: "dessert" });},
                [1496539523,-1015451899]
               );
    testPromise("searchDishes strawberry pie",
                function tw2_2_20_testPromise1(){return searchDishes({ query: "strawberry pie" });},
                [-1015451899]
               );
    testPromise("searchDishes no query, no type (empty object)",
                function tw2_2_20_testPromise1(){return searchDishes({});},
                []
               );
});
