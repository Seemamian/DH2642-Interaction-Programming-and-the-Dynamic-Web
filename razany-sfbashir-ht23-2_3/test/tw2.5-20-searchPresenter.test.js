import { expect } from "chai";
import makeModelProxyHandler from "./mockModel.js";
import {searchResults} from "./mockFetch.js";
import getModule from "./filesToTest.js";
import testComponent from "./testComponentTL";
import {asyncTestComponent} from "./testComponentTL";

import findCustomEvents from "./findCustomEvents.js";
import cloneModel from "./cloneModel.js";

const X = TEST_PREFIX;
const SearchPresenter= (await getModule(`/src/vuejs/${X}searchPresenter.jsx`))?.default;
const SearchPresenterReact= (await getModule(`/src/reactjs/${X}searchPresenter.jsx`))?.default;
const SearchFormView=(await getModule(`/src/views/${X}searchFormView.vue`))?.default ||
    (await getModule(`/src/views/${X}searchFormView.jsx`))?.default;
const SearchResultsView=(await getModule(`/src/views/${X}searchResultsView.vue`))?.default ||
    (await getModule(`/src/views/${X}searchResultsView.jsx`))?.default;
const modelTemplate= cloneModel((await getModule(`/src/${X}DinnerModel.js`))?.default);

const hasParams= modelTemplate?.searchParams;


describe("TW2.5 Presenter passing props and handling custom events: Search [test Vue](/tw2.5.2.html)[React](/tw2.5.2-react.html)[Final TW2 test Vue](/vue.html#/search)[Final TW2 test React](/react.html#/search)", async function tw2_5_20() {
    this.timeout(200000);

    before(function(){
        if (!SearchPresenter || !SearchFormView || !SearchResultsView) this.skip();
	if(!modelTemplate?.searchResultsPromiseState) this.skip();          
    });

    let searched, text, type, searchPars;
    if(hasParams)
    testComponent({
        vue: SearchPresenter,
        react: SearchPresenterReact,
        mock: [{component: SearchFormView, dummyText: "mock searchForm view"}, {component: SearchResultsView, dummyText: "mock searchResults view"}]},  
        {model: new Proxy({
            searchResultsPromiseState:{},
            searchParams:{query:"some test Query", type:"test Type"},
            doSearch(params){searched=true; searchPars=params;},
            setSearchQuery(txt){text=txt;},
            setSearchType(t){type = t;}
            },makeModelProxyHandler("Search presenter test"))},
        "$framework Search presenter passes text, type and dishTypeOptions props to SearchFormView",
	  function tw2_5_20_1(output, presenterProps, mockHandlers){
             expect(output.queryByText(/mock searchForm view/), "Search presenter should always render the search form view").to.be.ok;
            const searchFormViewProps = mockHandlers[0]?.propsHistory[0];

            expect(searchFormViewProps, "The SearchFormView should be sent props").to.be.ok;
            expect(searchFormViewProps, "prop 'text' not passed to SearchFormView").to.have.property("text");
            expect(searchFormViewProps.text, "prop 'text' sent to SearchFormView should be read from the model search params").to.equal("some test Query");

            expect(searchFormViewProps, "prop 'type' not passed to SearchFormView").to.have.property("text");
            expect(searchFormViewProps.type, "prop 'text' sent to SearchFormView should be read from the model search params").to.equal("test Type");
            
            expect(searchFormViewProps,"prop 'dishTypeOptions' not passed to SearchFormView").to.have.property("dishTypeOptions");
            expect(JSON.stringify(searchFormViewProps["dishTypeOptions"]), "the options passed should be an array containing starter, main course, dessert").to.equal(JSON.stringify(["starter", "main course", "dessert"]));
            searched = text = type = searchPars = undefined;
        }
    );

    // testing rendering changes in searchPresenter
    // const model = new DinnerModel();
    // testComponent({
    //     vue: SearchPresenter,
    //     //react: SearchPresenterReact
    // },{
    //     model: new Proxy(new DinnerModel()
    //     ,makeModelProxyHandler("Search presenter rendered with data, testing SearchResultsView custom events"))},
    //     "$framework SearchPresenter passes query and type to searchFormView",
    //     async function tw2_5_20_2(output, presenterProps, mockHandlers){
    //         expect(output.queryByText(/Taco Pizza/), "data shouldn't be rendered directly").to.not.be.ok;
    //         expect(output.queryByText(/no data/i), "when there is no promise, Search presenter should show 'no data'").to.be.ok;
    //         await waitFor(() => {
    //             console.log("no data", output.queryByText(/no data/i))
    //             console.log("bild", output.queryByRole('img'))
    //             console.log("data", output.queryByText(/Taco Pizza/))
    //             expect(output.queryByRole('img'), "When there is a promise but no data or error yet, Search presenter should render a loading image").to.be.ok;
    //         }, {timeout: 2000})
    //     }
    // );

    let searched2, text2, type2, searchPars2, dummyModel2;
    if(hasParams)
    testComponent({
        vue: SearchPresenter,
        react: SearchPresenterReact,
        mock: [{component: SearchFormView, dummyText: "mock searchForm view"}, {component: SearchResultsView, dummyText: "mock searchResults view"}]},  
        {model: dummyModel2 = new Proxy({
            searchResultsPromiseState: { },
            searchParams:{query:"some test Query", type:"test Type"},
            doSearch(params){searched2=true; searchPars2=params;},
            setSearchQuery(txt){text2=txt;},
            setSearchType(t){type2=t;},
        },makeModelProxyHandler("Search presenter test"))},
        "$framework Search presenter handles custom events fired by SearchFormView",
        function tw2_5_20_3(output, presenterProps, mockHandlers){
            expect(output.queryByText(/mock searchForm view/), "Search presenter should always render the search form view").to.be.ok;
            const searchFormViewProps = mockHandlers[0]?.propsHistory[0];

            const customEvents = findCustomEvents(SearchFormView, {dishTypeOptions:['starter', 'main course', 'dessert']})
            const onSearchHandler=customEvents.button.filter(function(button){return button.element.children.flat()[0].toLowerCase().trim().startsWith("search");})[0].customEventName;
            const onDishTypeHandler=customEvents.select[0].customEventName;
            const onTextHandler=customEvents.input[0].customEventName;
            
            expect(searchFormViewProps[onTextHandler], `custom event handler ${onTextHandler} should be a function`).to.be.a("function");
            expect(text2, "did not expect model method to be called during Search rendering, did you pass a function as custom event handler?").to.not.be.ok;
            searchFormViewProps[onTextHandler]("some test search query");
            expect(text2, "custom event handler "+onTextHandler+" should change search query in the model").to.equal("some test search query");
            
            expect(searchFormViewProps[onDishTypeHandler], `custom event handler ${onDishTypeHandler} should be a function`).to.be.a("function");
            expect(type2, "did not expect model method to be called during Search rendering, did you pass a function as custom event handler?").to.not.be.ok
            searchFormViewProps[onDishTypeHandler]("some test search type");
            expect(type2, "custom event handler "+onDishTypeHandler+" should change search type in the model").to.equal("some test search type");
            
            expect(searchFormViewProps[onSearchHandler], `custom event handler ${onSearchHandler} should be a function`).to.be.a("function");
            expect(searched2, "did not expect model method to be called during Search rendering, did you pass a function as custom event handler?").to.not.be.ok;
            searchFormViewProps[onSearchHandler]();      
            expect(searched2, "custom event handler "+onSearchHandler+" should trigger search in the model").to.equal(true);
            expect(searchPars2, "custom event handler "+onSearchHandler+" should trigger search in the model with the parameters filled in by the user").to.deep.equal(dummyModel2.searchParams);
            
            // resetting variables for react test
            searched2 = text2 = type2 = searchPars2 = undefined;
        }
    );

    const mdl= hasParams?{searchParams:{},}:   {doSearch(){}, };
    testComponent({
        vue: SearchPresenter,
        react: SearchPresenterReact,
        mock: [{component: SearchFormView, dummyText: "mock searchForm view"}, {component: SearchResultsView, dummyText: "mock searchResults view"}]},
		  [
		      {model: new Proxy({...mdl, searchResultsPromiseState:{}},makeModelProxyHandler("Search presenter with no promise"))},
		      {model: new Proxy({...mdl, searchResultsPromiseState:{promise:"bla"}},makeModelProxyHandler("Seach presenter with promise but no data or error"))},
		      {model: new Proxy({...mdl, searchResultsPromiseState:{promise:"bla", error:"big error"}},makeModelProxyHandler("DetailsPresenter with promise and error"))}
		      
		  ]	  ,
		  
		  "$framework Search presenter determines whether to render 'no data', loading image or error",
		  function tw2_5_20_1(output, presenterPropsIndex, mockHandlers){
		      expect(output.queryByText(/mock searchForm view/), "Search presenter should always render the search form view").to.be.ok;
		      const test= presenterPropsIndex===0 && output.queryByText(/no data/i)  ||
			    presenterPropsIndex===1 && output.queryByRole('img')  ||
			    presenterPropsIndex===2 && output.queryByText(/big error/i);
		      const msg= presenterPropsIndex===0 && "when there is no promise, Search presenter should show 'no data'"||
			    presenterPropsIndex===1 && "when there is a promise but no data or error yet, Search presenter should render a loading image"  ||
			    presenterPropsIndex===2 && "when there is a promise but it rejected, Search presenter should render a loading image";
		      
		      expect(test, msg).to.be.ok
		  });
    
    let dishId;
    testComponent({
        vue: SearchPresenter,
        react: SearchPresenterReact,
        mock: [{component: SearchFormView, dummyText: "mock searchForm view"}, {component: SearchResultsView, dummyText: "mock searchResults view"}]},  
        {model: new Proxy({
            ...mdl,
            searchResultsPromiseState: { promise: "foo", data: "bar" },
            setCurrentDish(id) {dishId=id;}
        },makeModelProxyHandler("Search presenter test"))},
        "$framework Search presenter sends the searchResults prop and handles custom event fired by SearchResultsView",
        function tw2_5_20_4(output, presenterProps, mockHandlers){
            expect(output.queryByText(/mock searchForm view/), "Search presenter should always render the search form view").to.be.ok;
            expect(output.queryByText(/mock searchResults view/), "Search presenter should render the search results view when there is a promise and data").to.be.ok;

            const searchResultsViewProps = mockHandlers[1]?.propsHistory[0];
            
            expect(searchResultsViewProps, "prersenter should pass props to SearchResutlsView").to.be.ok;
            expect(searchResultsViewProps, "SearchResultsView is missing the searchResults prop").to.have.property("searchResults");
            expect(searchResultsViewProps["searchResults"], "searchResults prop should be the data in search result promise state").to.equal("bar");
        
            const customEvents = findCustomEvents(SearchResultsView, {
                searchResults:[searchResults[0]]
            });
            const filteredSpan = customEvents.span.filter((span) => {
                return span?.element?.props?.onClick;
            });
            const oneHandler = filteredSpan[0].customEventName;
            
            expect(searchResultsViewProps[oneHandler],  `custom event handler ${oneHandler} should be a function`).to.be.a("function");
            
            // test that event handlers are not prematurely called
            expect(dishId, "did not expect model method to be called, did you pass a function as custom event handler?").to.equal(undefined);
            searchResultsViewProps[oneHandler]({id:42});
            expect(dishId, "custom event handler "+oneHandler+" should set current dish in the model").to.equal(42);  

            // resetting variables for react test
            dishId = undefined;

	    
        }
    );
});

