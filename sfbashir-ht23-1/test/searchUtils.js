import { assert, expect } from "chai";
import  {withMyFetch, mySearchFetch, findCGIParam, searchResults} from "./mockFetch.js";
import {findTag, prepareViewWithCustomEvents} from "./jsxUtilities.js";
import makeModelProxyHandler from "./mockModel.js";
import getModule from "./filesToTest.js";

const X= TEST_PREFIX;
const SearchFormView=(await getModule(`/src/views/${X}searchFormView.jsx`))?.default;
const SearchResultsView=(await getModule(`/src/views/${X}searchResultsView.jsx`))?.default;


function findFormEventNames(){
    const {customEventNames, customEventParams}= prepareViewWithCustomEvents(
        SearchFormView,
        {dishTypeOptions:['starter', 'main course', 'dessert']},
        function collectControls(rendering){
            const buttons=findTag("button", rendering).filter(function(button){ return button.children.flat()[0].toLowerCase().trim().startsWith("search"); });
            const selects=findTag("select", rendering);
            const inputs=findTag("input", rendering);
            expect(buttons.length, "SearchFormview expected to have one search button").to.equal(1);
            expect(inputs.length, "SearchFormView expected to have one  input box").to.equal(1);
            expect(selects.length, "SearchFormView expected to have one  select box").to.equal(1);
            return [...inputs, ...selects, ...buttons];
        },
        ["some test query", "some test type"]
    );

    const [onInput, onSelect, onButton]=customEventNames;
    const [inputParam, selectParam]= customEventParams;
    
    expect(inputParam.length, "expected custom event "+onInput+" to be fired with one parameter").to.equal(1);
    expect(inputParam[0], "expected custom event "+onInput+" to get as parameter the value typed in the input box").to.equal("some test query");
    
    expect(selectParam.length, "expected custom event "+onSelect+" to be fired with one parameter").to.equal(1);
    expect(selectParam[0], "expected custom event "+ onSelect+" to get as parameter the value chosen in the dropdown").to.deep.equal("some test type");
    return customEventNames;
}

//var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
//nativeInputValueSetter.call(input, 'react 16 value');

function findResultsEventName(){
    const {customEventNames, customEventParams}= prepareViewWithCustomEvents(
        SearchResultsView,
        {searchResults:[searchResults[0]]},
        function findSpans(rendering){
            const spans= findTag("span", rendering).filter(function checkSpanCB(span){ return span.props && span.props.onClick; });
            expect(spans.length, "SearchResultsView with one result should contain at least a span with click handler").to.gte(1);
            return spans;
        });
    const[onDishClick]= customEventNames;
    const[dishChosen]= customEventParams;
    expect(dishChosen.length, "expected custom event "+onDishClick+" to be fired with one parameter").to.equal(1);
    expect(dishChosen[0], "expected custom event "+onDishClick+" to get a search result as parameter").to.equal(searchResults[0]);

    return customEventNames;
}


const dummyImgName = "promise loading image GIF";

function makeRender(formProps, resultsProps, h, render, theReact, makeRoot, makeModel){
    function DummyForm(props){
        formProps.push(props);
        return h("span", {}, "dummy form");
    }
    function DummyResults(props){
        resultsProps.push({...props});
        return h("span", {}, "dummy results");
    }

    function DummyImg(props){
        resultsProps.push(dummyImgName);
        return "dummyIMG";
    }
    
    function DummyNoData(props){
        resultsProps.push("no promise, no data");
        return "no data";
    }    
    function replaceViews(tag, props, ...children){
        if(tag==SearchFormView)
            return h(DummyForm, props);
        if(tag==SearchResultsView)
            return h(DummyResults, props);
        if(tag=="img") // FIXME this assumes that the presenter renders no other image than the spinner
            return h(DummyImg, props);
        if(tag=="div" && children && children[0] && (""+children[0]).toLowerCase()=="no data")
            return h(DummyNoData, props);
        return h(tag, props, ...children);
    };
    return async function doRender(){
        const div= document.createElement("div");
        window.React= theReact;
        window.React.createElement= replaceViews;
        formProps.length=0;
        resultsProps.length=0;

        await withMyFetch(
            mySearchFetch,
            function theRender(){
                render(makeRoot(makeModel("Search presenter")), div);
                // should be "no data", under the form
                //console.error(div.firstElementChild.firstElementChild.nextSibling);
            },
            function makeResults(url){
                return {results:searchResults};
            }  
        );

        expect(div.firstElementChild, "nothing was rendered, do you miss a return statement?").to.be.ok;
        return div;
    };
}





function doTests(framework, h, render, theReact, makeRoot){
    const formProps=[];
    const resultsProps=[];

    let currentDishId;
    const oldParams={};
    
    let initialPromiseState;
    let usedSearch;
    
    function makeModel(context){
        return new Proxy({
            setCurrentDish(id){
                currentDishId=id;
            },
            doSearch(params){
                usedSearch=true;
                const promise= fetch("No_real_fetch_should_be_executed_with_this_URL__You_will_see_a_404"+new URLSearchParams(params).toString()).then(r=>{
                    if(r.ok) return r.json().then(x=>x.results);
                    throw new Error("Probably infinite re-render "+r.status);
                });
                this.searchResultsPromiseState.promise=promise;
                this.searchResultsPromiseState.data=null;
                promise.then(results=>this.searchResultsPromiseState.promise===promise && (this.searchResultsPromiseState.data=results));
            },
            searchResultsPromiseState: initialPromiseState||{},
            setSearchQuery(query){ this.searchParams.query=query; },
            setSearchType(type){ this.searchParams.type=type; },
            searchParams:{},
        }, makeModelProxyHandler(context)) ;
    };
    
    
    const doRender= makeRender(formProps, resultsProps, h, render, theReact, makeRoot, makeModel);

    function checkResults(div, res){
        expect(resultsProps.length, "no promiseNoData or SearchResultView are rendered").to.be.ok;
        
        expect(resultsProps.slice(-1)[0].searchResults, "search results view should be rendered after promise resolve").to.eql(res);
        expect(resultsProps.slice(-2)[0], "an image should be rendered before promise resolve").to.equal(dummyImgName);
        
        // TODO: at this point, all values before dummyImgName (image), should be the previous results (which can be a parameter to checkResults)
        // then a number of dummyImgName are acceptable
        
        expect(div.firstElementChild.firstElementChild.nextSibling.tagName, "the search results view expected to be rendered after promise resolve").to.equal("SPAN");
        expect(div.firstElementChild.firstElementChild.nextSibling.textContent, "the search results view expected to be rendered after promise resolve").to.equal("dummy results");
    }

    it(framework+" search presenter initial test", async function tw3_2_20_1(){
        const [setText, setType, doSearch]= findFormEventNames();
        const div= await doRender();
        try{
            await mySearchFetch.lastPromise;
        }catch(e){
            console.error(e);
        }
        await new Promise(resolve => setTimeout(resolve));  // UI update
        expect(formProps.length, "no SearchFormView was rendered").to.be.ok;

        expect(formProps.slice(-1)[0][setType], "expected the SearchFormView "+setType+" custom event handler prop to be a function").to.be.a("Function");
        expect(formProps.slice(-1)[0][setText],  "expected the SearchFormView "+setText+" custom event handler prop to be a function").to.be.a("Function");
        expect(formProps.slice(-1)[0][doSearch],  "expected the SearchFormView "+doSearch+" custom event handler prop to be a function").to.be.a("Function");

        await new Promise(resolve => setTimeout(resolve));  // UI update
        
       // checkResults(div, searchResults);

        mySearchFetch.lastFetch=undefined;
        resultsProps.length=0;
        await withMyFetch(  
            mySearchFetch,
            async function interact(){
                formProps.slice(-1)[0][setType]("main course");
                formProps.slice(-1)[0][setText]("calzone");
                formProps.slice(-1)[0][doSearch]();
            },
            function makeResults(url){
                return {results:[searchResults[1], searchResults[0]]};
            }            
        );

        expect(mySearchFetch.lastFetch, "presenter should initiate a search at button click").to.be.ok;
        expect(findCGIParam(mySearchFetch.lastFetch, "type", "main course"), "search should use type parameter from state").to.be.ok;
        expect(findCGIParam(mySearchFetch.lastFetch, "query", "calzone"), "search should use text parameter from state").to.be.ok;

        await mySearchFetch.lastPromise;
        await new Promise(resolve => setTimeout(resolve));  // UI update

        checkResults(div, [searchResults[1], searchResults[0]]);
        expect(usedSearch, "the lab exercise demands the search promise to be solved in application state. Use model.doSearch(TODO)").to.be.ok;
    });

    it("On successive searches, "+framework+ " search presenter only renders results of last search (race condition check)", async function tw3_2_20_6(){
        const [setText, setType, doSearch]= findFormEventNames();
        const div= await doRender();
        await new Promise(resolve => setTimeout(resolve)); // wait for initial promise to resolve
        
        mySearchFetch.lastFetch=undefined;
        const formLen= formProps.length;
        let formLen2;
        await withMyFetch(
            mySearchFetch,
            async function interact(){
                formProps.slice(-1)[0][setType]("dessert");
                formProps.slice(-1)[0][doSearch]();
                formProps.slice(-1)[0][setType]("starter");
                formProps.slice(-1)[0][doSearch]();
            },
            function makeResults(url){
                if(url.indexOf("dessert")!=-1)
                    return {results:[searchResults[1], searchResults[0]], delay:3};   // first, slower search, 2 results
                else
                    return {results:[searchResults[1]]};    // second, faster search, 1 result
            }
        );

        await new Promise(resolve => setTimeout(resolve, 5));  // UI update
        
        checkResults(div, [searchResults[1]]);
        expect(resultsProps.find(p=> p.searchResults?.length==2), "the first, slower search should not save in promise state").to.not.be.ok;
    });

    it(framework +" search presenter uses component lifecycle to trigger first search", async function tw3_2_20_5_1(){
        const div= await doRender();
        
        await mySearchFetch.lastPromise;
        await new Promise(resolve => setTimeout(resolve));  // UI update
        expect(formProps.length, "no SearchFormView was rendered").to.be.ok;
        
        if(resultsProps.slice(-1)[0]=="no promise, no data"){
            expect.fail("no initial search results rendered, just \"no data\", most probably because no initial search promise has been initiated. Please check the manual test!");
        }
        
        checkResults(div, searchResults);
        
        expect(mySearchFetch.lastFetch, "expecting 'component is born' lifecycle to initiate a search").to.be.ok;
        if(!(mySearchFetch.lastFetch.indexOf("?")==-1 || mySearchFetch.lastFetch.indexOf("?")==mySearchFetch.lastFetch.length-1))
            expect.fail("expected  'component is born' lifecycle to initiate a search with empty parameters");
        expect(resultsProps[0], "expected 'no data' to be rendered briefly before  'component is born' lifecycle takes effect").to.equal("no promise, no data");
        
    });
       
    
    it(framework +" search presenter does not initiate a promise at initialization if there is already data in the promise state", async function tw3_2_20_1(){
        initialPromiseState={promise: "dummy promise", data:"dummy data"};
        const div= await doRender();
        await new Promise(resolve => setTimeout(resolve));  // UI update
        expect(resultsProps.length, "if there is already data in the promise state, no promise is initiated").to.equal(1);
        expect(resultsProps[0].searchResults, "if there is already data in the promise state, it is passed to the view").to.equal("dummy data");
    });
}

                 

export {doTests, dummyImgName, findFormEventNames, findResultsEventName};


/* version until 2023.02.20 was assuming that Vue search presenter uses component state. We may want to come back to that */

/*
// this one seems to be identical with the first test...

    it("Search presenter object component test, convert your functional component to an object!", async function tw3_2_20_2(){
        expect(SearchPresenter, "presenter must now be an object so we can add state").to.be.a("Object");
        const [setText, setType, doSearch]= findFormEventNames();
        const div= await doRender();

        await mySearchFetch.lastPromise;
        await new Promise(resolve => setTimeout(resolve));  // UI update

        expect(formProps.slice(-1)[0][setType]).to.be.a("Function");
        expect(formProps.slice(-1)[0][setText]).to.be.a("Function");
        expect(formProps.slice(-1)[0][doSearch]).to.be.a("Function");

        mySearchFetch.lastFetch=undefined;
        resultsProps.length=0;
        await withMyFetch(  
            mySearchFetch,
            async function interact(){
                formProps.slice(-1)[0][setType]("main course");
                formProps.slice(-1)[0][setText]("calzone");
                formProps.slice(-1)[0][doSearch]();
            },
            function makeResults(url){
                return {results:[searchResults[1], searchResults[0]]};
            }            
        );

        expect(mySearchFetch.lastFetch, "presenter should initiate a search at button click").to.be.ok;
        expect(findCGIParam(mySearchFetch.lastFetch, "type", "main course"), "search should use type parameter from state").to.be.ok;
        expect(findCGIParam(mySearchFetch.lastFetch, "query", "calzone"), "search should use text parameter from state").to.be.ok;

        await mySearchFetch.lastPromise;
        await new Promise(resolve => setTimeout(resolve));  // UI update
        
        checkResults(div, [searchResults[1], searchResults[0]]);
        
    });

    
    it("Search presenter object component stores search parameters in component state", async function tw3_2_20_3(){
        expect(SearchPresenter, "presenter must now be an object so we can add state").to.be.a("Object");
        const [setText, setType, doSearch]= findFormEventNames();

        const div= await doRender();

        await mySearchFetch.lastPromise;
        await new Promise(resolve => setTimeout(resolve));  // UI update

        expect(formProps.slice(-1)[0][setType]).to.be.a("Function");
        expect(formProps.slice(-1)[0][setText]).to.be.a("Function");
        expect(formProps.slice(-1)[0][doSearch]).to.be.a("Function");
        
        mySearchFetch.lastFetch=undefined;
        resultsProps.length=0;
        
        formProps.slice(-1)[0][setType]("main course");
        formProps.slice(-1)[0][setText]("calzone");

        //expect(vueModel.searchParams, "You should not store search params in application state (model) any longer").to.be.empty;
        const {searchResultsPromiseState, searchParams, a_DH2642_note, ...rest}= vueModel;
        expect(JSON.stringify(rest),  "You should not modify application state (model) to store search parameters").to.equal("{}");
    });

    it("Search presenter resolves the promise in component state after filling the form and button click", async function tw3_2_20_4(){
        const [setText, setType, doSearch]= findFormEventNames();
        const [resultChosen]= findResultsEventName();

        const div= await doRender();
        await mySearchFetch.lastPromise;
        await new Promise(resolve => setTimeout(resolve)); // wait for eventual promise to resolve

        expect(formProps.slice(-1)[0][setType]).to.be.a("Function");
        expect(formProps.slice(-1)[0][setText]).to.be.a("Function");
        expect(formProps.slice(-1)[0][doSearch]).to.be.a("Function");
        
        mySearchFetch.lastFetch=undefined;
        resultsProps.length=0;
        await withMyFetch(   
            mySearchFetch,
            async function interact(){
                formProps.slice(-1)[0][setType]("main course");
                formProps.slice(-1)[0][setText]("pizza");
                formProps.slice(-1)[0][doSearch]();
            },
            function makeResults(url){
                return {results:[searchResults[1], searchResults[0]]};
            }            
        );
        expect(vueModel.searchParams, "You should not store search params in application state any longer").to.be.empty;
        expect(vueModel.searchResultsPromiseState, "You should not resolve the promise in application state any longer").to.be.empty;
        const {searchResultsPromiseState, searchParams, a_DH2642_note, ...rest}= vueModel;
        expect(JSON.stringify(rest),  "You should not modify application state (model) from Search presenter for search purposes").to.equal("{}");

        
        expect(mySearchFetch.lastFetch, "presenter should launch a search at button click").to.be.ok;
        expect(findCGIParam(mySearchFetch.lastFetch, "type", "main course"), "search should use type parameter from state").to.be.ok;
        expect(findCGIParam(mySearchFetch.lastFetch, "query", "pizza"), "search should use text parameter from state").to.be.ok;
        
        await mySearchFetch.lastPromise;
        await new Promise(resolve => setTimeout(resolve));  // UI update

        checkResults(div, [searchResults[1], searchResults[0]]);
        
        resultsProps.slice(-1)[0][resultChosen]({id:43});
        expect(currentDishId, "clicking on a search results should set the current dish in the model").to.equal(43);
    });

    it("Search presenter initiates a search promise at first render and resolves the promise in component state", async function tw3_2_20_5(){
        const [resultChosen]= findResultsEventName();
        mySearchFetch.lastFetch=undefined;
        resultsProps.length=0;

        const div= await doRender();

        expect(JSON.stringify(formProps.slice(-1)[0]["dishTypeOptions"]), "the options passed are not correct").to.equal(
            JSON.stringify(["starter", "main course", "dessert"])
        );

        expect(vueModel.searchParams, "You should not store search params in application state any longer").to.be.empty;
        expect(vueModel.searchResultsPromiseState, "You should not resolve the promise in application state any longer").to.be.empty;
        const {searchResultsPromiseState, searchParams, a_DH2642_note, ...rest}= vueModel;
        expect(JSON.stringify(rest),  "You should not modify application state (model) from Search presenter for search purposes").to.equal("{}");

        
        expect(mySearchFetch.lastFetch, "presenter should initiate a search at component creation").to.be.ok;
        expect(findCGIParam(mySearchFetch.lastFetch, "type", ""), "first search launched by presenter should be with empty params").to.be.ok;
        expect(findCGIParam(mySearchFetch.lastFetch, "query", ""), "first search launched by presenter should be with empty params").to.be.ok;
        
        await mySearchFetch.lastPromise;
        await new Promise(resolve => setTimeout(resolve)); // wait for eventual promise to resolve
      
        checkResults(div, searchResults);
        
        expect(resultsProps.slice(-1)[0][resultChosen]).to.be.a("Function");
        resultsProps.slice(-1)[0][resultChosen]({id:42});
        expect(currentDishId, "clicking on a search results should set the current dish in the model").to.equal(42);
    });
*/
