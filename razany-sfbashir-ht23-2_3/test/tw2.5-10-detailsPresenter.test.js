import { expect } from "chai";
import {dishInformation} from "./mockFetch.js";
import makeModelProxyHandler from "./mockModel.js";
import testComponent from "./testComponentTL.js";
import getModule from "./filesToTest.js";
import findCustomEvents from "./findCustomEvents.js";
import cloneModel from "./cloneModel.js";

const X = TEST_PREFIX;
const DetailsPresenter= (await getModule(`/src/vuejs/${X}detailsPresenter.jsx`))?.default;
const DetailsPresenterReact= (await getModule(`/src/reactjs/${X}detailsPresenter.jsx`))?.default;
const DetailsView=(await getModule(`/src/views/${X}detailsView.vue`))?.default ||
    (await getModule(`/src/views/${X}detailsView.jsx`))?.default;
const modelTemplate= cloneModel((await getModule(`/src/${X}DinnerModel.js`))?.default);

describe("TW2.5 Presenter passing props and custom events: Details presenter [test Vue](/tw2.5.1.html)[React](/tw2.5.1-react.html)", function tw2_5_10() {
    this.timeout(200000);
    before(function(){
            if(!DetailsPresenter) this.skip();
        let model = cloneModel(modelTemplate);
            if(!model?.currentDishPromiseState) this.skip();
        });

    testComponent({
        vue: DetailsPresenter,
        react: DetailsPresenterReact,
        mock: [{component: DetailsView, dummyText: "mock details view"}]},  
		  [
		      {model: new Proxy({currentDishPromiseState:{}},makeModelProxyHandler("Details presenter with no promise"))},
		      {model: new Proxy({currentDish: dishInformation.id, currentDishPromiseState:{promise:"bla"}},makeModelProxyHandler("Details presenter with no promise data"))},
		      {model: new Proxy({currentDish: dishInformation.id, currentDishPromiseState:{promise:"bla", error:"big error"}},makeModelProxyHandler("Details presenter with promise and error"))}
		  ],
		  "$framework Details presenter determines whether to render 'no data', loading image, or error",
		  function tw2_5_10_1(output, presenterPropsIndex, mockHandlers){
		      const test= presenterPropsIndex===0 && output.queryByText(/no data/i)  ||
			    presenterPropsIndex===1 && output.queryByRole('img')  ||
			    presenterPropsIndex===2 && output.queryByText(/big error/i);
		      const msg= presenterPropsIndex===0 && "when there is no promise, Details presenter should show 'no data'"||
			    presenterPropsIndex===1 && "when there is a promise but no data or error yet, Details presenter should render a loading image"  ||
			    presenterPropsIndex===2 && "when there is a promise but it rejected, Details presenter should render a loading image";
			    
		      expect(test, msg).to.be.ok
        }
    );

    testComponent({
        vue: DetailsPresenter,
        react: DetailsPresenterReact,
        mock: [{component: DetailsView, dummyText: "mock details view"}]},  
        {model: new Proxy({currentDishPromiseState:{promise:"bla", data:dishInformation}, currentDish:dishInformation.id, dishes:[], numberOfGuests:4},
            makeModelProxyHandler("DetailsPresenter with promise data"))},
        "$framework Details presenter renders DetailsView with props calculated from the model: guests, isDishInMenu, dishData",
        function tw2_5_10_2(output, presenterPropsIndex, mockHandlers){
            expect(output.queryByText(/mock details view/), "DetailsPresenter should render DetailsView if the promise state includes data").to.be.ok;
            expect(mockHandlers[0]?.propsHistory[0]?.guests, "DetailsView guest prop must be read from the model").to.equal(4);
            expect(mockHandlers[0]?.propsHistory[0]?.isDishInMenu, "DetailsView isDishInMenu prop expected to be falsy with empty menu").to.not.be.ok;
            expect(mockHandlers[0]?.propsHistory[0]?.dishData, "DetailsView dishData prop expected to be read from the currentDish promise state").to.deep.equal(dishInformation)
        }
    );

    let dishAdded;
    testComponent({
        vue: DetailsPresenter,
        react: DetailsPresenterReact,
        mock: [{component: DetailsView, dummyText: "mock details view"}]},  
        {model: new Proxy({currentDishPromiseState:{promise:"bla", data: dishInformation},currentDish: dishInformation.id,dishes:[dishInformation],numberOfGuests:5,
            addToMenu(dish){dishAdded=dish;},searchResultsPromiseState:{}}, makeModelProxyHandler("DetailsPresenter with promise data, custom event test"))},
        "$framework DetailsPresenter handles custom event to add the dish to the menu",
        function tw2_5_10_3(output, presenterPropsIndex, mockHandlers){
            expect(mockHandlers[0]?.propsHistory[0]?.isDishInMenu, "DetailsView isDishInMenu prop expected to be truthy if the dish is in menu").to.be.ok;
            expect(mockHandlers[0]?.propsHistory[0]?.guests, "DetailsView guest prop must be read from the model").to.equal(5);

            const buttonsCE = findCustomEvents(DetailsView, {dishData:dishInformation, isDishInMenu:true, guests:6}).button;
            const addToMenu = buttonsCE.filter((button)=>{return button?.element?.props?.disabled;})[0].customEventName;

            expect(mockHandlers[0]?.propsHistory[0][addToMenu], "expecting the custome event handler "+addToMenu+" to be a function").to.be.a("function");
            mockHandlers[0]?.propsHistory[0][addToMenu]();
            expect(dishAdded, "expecting the custome event handler "+addToMenu+" to add a dish").to.deep.equal(dishInformation);
        }
    );
});

