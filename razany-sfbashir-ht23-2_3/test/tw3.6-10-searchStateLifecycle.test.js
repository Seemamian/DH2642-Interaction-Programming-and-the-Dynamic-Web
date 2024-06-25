import { expect } from "chai";
import makeModelProxyHandler from "./mockModel.js";
import {searchResults} from "./mockFetch.js";
import getModule from "./filesToTest.js";
import testComponent from "./testComponentTL";
import {asyncTestComponent} from "./testComponentTL";

import findCustomEvents from "./findCustomEvents.js";
import cloneModel from "./cloneModel.js";

//import { server } from "./mocks/testServer.js"; // Comment to disable MWS
// import { waitFor } from "@testing-library/react";

const X = TEST_PREFIX;
const SearchPresenter= (await getModule(`/src/vuejs/${X}searchPresenter.jsx`))?.default;
const SearchPresenterReact= (await getModule(`/src/reactjs/${X}searchPresenter.jsx`))?.default;
const SearchFormView=(await getModule(`/src/views/${X}searchFormView.vue`))?.default ||
    (await getModule(`/src/views/${X}searchFormView.jsx`))?.default;
const SearchResultsView=(await getModule(`/src/views/${X}searchResultsView.vue`))?.default ||
    (await getModule(`/src/views/${X}searchResultsView.jsx`))?.default;
const modelTemplate= cloneModel((await getModule(`/src/${X}DinnerModel.js`))?.default);


describe("Bonus: search params in component state, initial search using component lifecycle (remove model.searchParams to enable) [test Vue](/tw2.5.2.html)[React](/tw2.5.2-react.html)", async function tw3_6_10() {
    this.timeout(200000);

    before(function(){
        if (!SearchPresenter || !SearchFormView || !SearchResultsView) this.skip();
        let model = cloneModel(modelTemplate);
        if(!model?.searchResultsPromiseState) this.skip();          
        if(model?.searchParams) this.skip();
    });

    let searched, text, type, searchPars;
    testComponent({
        vue: SearchPresenter,
        react: SearchPresenterReact,
        mock: [{component: SearchFormView, dummyText: "mock searchForm view"}, {component: SearchResultsView, dummyText: "mock searchResults view"}]},  
        {model: new Proxy({
            searchResultsPromiseState:{promise:"foo"},
            doSearch(params){searched=true; searchPars=params;},
            },makeModelProxyHandler("Search presenter with component state"))},
		  "$framework stateful Search presenter passes text, type props to SearchFormView",
        function tw3_6_10_1(output, presenterProps, mockHandlers){
            expect(output.queryByText(/mock searchForm view/), "Search presenter should always render the search form view").to.be.ok;
            expect(output.queryByRole('img'), "When there is a promise but no data or error yet, Search presenter should render a loading image").to.be.ok;

            const searchFormViewProps = mockHandlers[0]?.propsHistory[0];

            expect(searchFormViewProps, "The SearchFormView should be sent props").to.be.ok;
            expect(searchFormViewProps, "prop 'text' not passed to SearchFormView").to.have.property("text");
            expect(searchFormViewProps.text, "initial prop 'text' should be falsy").to.not.be.ok;

            expect(searchFormViewProps, "prop 'type' not passed to SearchFormView").to.have.property("text");
            expect(searchFormViewProps.text, "initial prop 'type' should be falsy").to.not.be.ok;
            
            expect(searchFormViewProps,"prop 'dishTypeOptions' not passed to SearchFormView").to.have.property("dishTypeOptions");
            expect(JSON.stringify(searchFormViewProps["dishTypeOptions"]), "the options passed should be an array containing starter, main course, dessert").to.equal(JSON.stringify(["starter", "main course", "dessert"]));
            searched = text = type = searchPars = undefined;
        }
    );

    let searched2, text2, type2, searchPars2, dummyModel2;
    asyncTestComponent({
        vue: SearchPresenter,
        react: SearchPresenterReact,
        mock: [{component: SearchFormView, dummyText: "mock searchForm view"}, {component: SearchResultsView, dummyText: "mock searchResults view"}]},  
        {model: dummyModel2 = new Proxy({
            searchResultsPromiseState: {},
            doSearch(params){searched2=true; searchPars2=params;},
        },makeModelProxyHandler("Search presenter test"))},
        "$framework stateful Search presenter handles custom events fired by SearchFormView and changes its state",
        async function tw3_6_10_2(output, presenterProps, mockHandlers){
            expect(output.queryByText(/mock searchForm view/), "Search presenter should always render the search form view").to.be.ok;
            const searchFormViewProps = mockHandlers[0]?.propsHistory[0];

            const customEvents = findCustomEvents(SearchFormView, {dishTypeOptions:['starter', 'main course', 'dessert']});
            const onSearchHandler=customEvents.button.filter(function(button){return button.element.children.flat()[0].toLowerCase().trim().startsWith("search");})[0].customEventName;
            const onDishTypeHandler=customEvents.select[0].customEventName;
            const onTextHandler=customEvents.input[0].customEventName;
            
            expect(searchFormViewProps[onTextHandler], `custom event handler ${onTextHandler} should be a function`).to.be.a("function");
            searchFormViewProps[onTextHandler]("some test search query");
	    await output.findByText("mock searchForm view 2");

            expect(mockHandlers[0].propsHistory.length, "when the custom event "+onTextHandler+" fires, a presenter re-render is expected due to changing component state").to.equal(2);
            expect(mockHandlers[0].propsHistory[1].text, "custom event handler "+onTextHandler+" should change search query in comoponent state and pass it to the view").to.equal("some test search query");

            expect(searchFormViewProps[onDishTypeHandler], `custom event handler ${onDishTypeHandler} should be a function`).to.be.a("function");
            searchFormViewProps[onDishTypeHandler]("some test search type");
	    await output.findByText("mock searchForm view 3");

            expect(mockHandlers[0].propsHistory.length, "when the custom event "+onDishTypeHandler+" fires, a presenter re-render is expected due to changing component state").to.equal(3);
            expect(mockHandlers[0].propsHistory[2].type, "custom event handler "+onDishTypeHandler+" should change search type in comoponent state and pass it to the view").to.equal("some test search type");

            searched2= undefined;
            searchPars2= undefined;
            expect(searchFormViewProps[onSearchHandler], `custom event handler ${onSearchHandler} should be a function`).to.be.a("function");
            mockHandlers[0].propsHistory[2][onSearchHandler]();      
            expect(searched2, "custom event handler "+onSearchHandler+" should trigger search in the model").to.equal(true);
            expect(searchPars2, "custom event handler "+onSearchHandler+" should trigger search in the model with the parameters filled in by the user").to.deep.equal({query: "some test search query", type:"some test search type"});
            
            // resetting variables for react test
            searched2 = text2 = type2 = searchPars2 = undefined;
        }
    );

    let searched3;
    let searchParam;

    async function tw3_6_10_3(output, presenterProps, mockHandlers){
        expect(output.queryByText(/mock searchForm view/), "Search presenter should always render the search form view").to.be.ok;
        expect(output.queryByText(/no data/i), "initially, stateful Search presenter should show 'no data'").to.be.ok;
        
        expect(searched3, "search presenter must perform a search at first render").to.be.ok;
        expect(searchParam, "search performed via component lifecycle has an empty object as parameter").to.deep.equal({});
        // resetting variables for react test
        searched3 = undefined;
        searchParam= undefined;
	output.reactiveModel.searchResultsPromiseState= {promise:"bla"};
	await output.findByRole("img");
	output.reactiveModel.searchResultsPromiseState= {promise:"bla", data:"foo"};
	await output.findByText("mock searchResults view 1");
    }

    const mdl=//new Proxy(
	  {
              searchResultsPromiseState: {},
              doSearch(x){searched3 = true; searchParam=x;}
	  }//makeModelProxyHandler("Search presenter test"))
    ;
    const mock= [{component: SearchFormView, dummyText: "mock searchForm view"}, {component: SearchResultsView, dummyText: "mock searchResults view"}];
    const name="$framework stateful Search presenter performs an initial search using component lifecycle";

    // testing the frameworks separately because the reactive models seem to collide
    asyncTestComponent(
	{
            vue: SearchPresenter,
            mock
	},
	{model: {...mdl },},
	name,
	tw3_6_10_3
    );

    asyncTestComponent(
	{
	    react: SearchPresenterReact,
            mock
	},  
	{model: {...mdl },},
	name,
	tw3_6_10_3
    );
});
