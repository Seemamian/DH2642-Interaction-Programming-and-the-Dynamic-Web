import {render} from "./teacherRender.js";
import {searchResults} from "../test/mockFetch.js";
import getModule from "/test/filesToTest.js";
import getType from "/test/componentType.js";

const X= TEST_PREFIX;

const SearchResultsView=(await getModule(`/src/views/${X}searchResultsView.jsx`))?.default;

if(!SearchResultsView){
    render(<div>Please write /src/views/searchResultsView.jsx to define SearchResultsView
           </div>,  document.getElementById('root'));
}
if(SearchResultsView){
  const preamble= <div><p> This is the TW2.3 search result view test</p>
                    <p>It waits for one second to simulate a search, then it displays three search results. Of course your view should accomodate more results, using array rendering</p>
                    <p>You can edit tw/tw2.3.1.js to write the name of the custom event that you are firing when a search result is clicked on, so you can test custom event firing</p>
                    <hr/></div>;
    render(
        <div>{preamble}Wait...</div>,
        document.getElementById('root')
    );
    // we simulate a searchDishes that returns some results after 1 second
    new Promise(function makePromiseACB(resolve){
        setTimeout(function laterACB(){
            resolve(searchResults);
        }, 1000);
    })
    .then(
        function displayResultsACB(results){
            render(<div>{preamble}
                   <SearchResultsView searchResults={results}
                   displayDishInfo={function resultChosenACB(searchResult){ console.log("user chose searchResult: ", JSON.stringify(searchResult)); }}
                   /></div>
                , document.getElementById('root')
            );
        });
}
