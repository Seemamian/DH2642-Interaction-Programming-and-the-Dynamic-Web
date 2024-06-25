import { expect } from "chai";
import {dishInformation} from "./mockFetch.js";
import makeModelProxyHandler from "./mockModel.js";
import testComponent from "./testComponentTL.js";
import {asyncTestComponent} from "./testComponentTL";
import getModule from "./filesToTest.js";
import findCustomEvents from "./findCustomEvents.js";
import cloneModel from "./cloneModel.js";

import {withMyFetch, myDetailsFetch} from "./mockFetch.js";


const X = TEST_PREFIX;
const DetailsPresenter= (await getModule(`/src/vuejs/${X}detailsPresenter.jsx`))?.default;
const DetailsPresenterReact= (await getModule(`/src/reactjs/${X}detailsPresenter.jsx`))?.default;
const DetailsView=(await getModule(`/src/views/${X}detailsView.vue`))?.default ||
    (await getModule(`/src/views/${X}detailsView.jsx`))?.default;
const modelTemplate= cloneModel((await getModule(`/src/${X}DinnerModel.js`))?.default);

describe("Bonus: current dish promise state in component state (remove model.currentDishPromiseState to enable) [test Vue](/tw2.5.1.html)[React](/tw2.5.1-react.html)", function tw3_6_20() {
    this.timeout(200000);
    before(function(){
        if(!DetailsPresenter) this.skip();
        let model = cloneModel(modelTemplate);
        if(!model?.searchResultsPromiseState) this.skip();
        if(model?.currentDishPromiseState) this.skip();
    });

    let dishAdded;

    async  function tw3_6_20_1(output, presenterPropsIndex, mockHandlers){
	expect( output.queryByText(/no data/i),"when there is no currentDish, stateful Details presenter should show 'no data'").to.be.ok;
	withMyFetch(myDetailsFetch,
		    function() {
			output.reactiveModel.currentDish= dishInformation.id;
		    });

	await output.findByRole("img");
	await output.findByText(/mock details view/);

        expect(mockHandlers[0]?.propsHistory[0]?.guests, "DetailsView guest prop must be read from the model").to.equal(3);
        expect(mockHandlers[0]?.propsHistory[0]?.isDishInMenu, "DetailsView isDishInMenu prop expected to be falsy with empty menu").to.not.be.ok;
        expect(mockHandlers[0]?.propsHistory[0]?.dishData.id, "DetailsView dishData prop expected to be the result of getDishDetails").to.equal(dishInformation.id);

	output.reactiveModel.dishes=[dishInformation];
	await output.findByText(/mock details view 2/);  // 2nd rendering of DetailsView
        expect(mockHandlers[0]?.propsHistory[1]?.isDishInMenu, "DetailsView isDishInMenu prop expected to become truthy when the dish is added to the menu").to.be.ok;

	const buttonsCE = findCustomEvents(DetailsView, {dishData:dishInformation, isDishInMenu:true, guests:6}).button;
        const addToMenu = buttonsCE.filter((button)=>{return button?.element?.props?.disabled;})[0].customEventName;
	
        expect(mockHandlers[0]?.propsHistory[1][addToMenu], "expecting the custome event handler "+addToMenu+" to be a function").to.be.a("function");
        mockHandlers[0]?.propsHistory[1][addToMenu]();
        expect(dishAdded.id, "expecting the custom event handler "+addToMenu+" to add the dish to the menu").to.equal(dishInformation.id);
    }

    
    const mdl= { numberOfGuests:3, dishes: [], addToMenu(dish){dishAdded=dish;}};
    const testName= "$framework stateful Details presenter observes the reactive model and resolves a dish details promise in its state";
    const mock= [{component: DetailsView, dummyText: "mock details view"}];

    // testing the frameworks separately because the reactive models seem to collide
    asyncTestComponent(
	{
            vue: DetailsPresenter,
	    mock
	},  
	{  model:{ ...mdl}  },
	testName,
	tw3_6_20_1
    );
    
    asyncTestComponent(
	{
            react: DetailsPresenterReact,
            mock
	},  
	{  model:{ ...mdl}  },
	testName,
	tw3_6_20_1
    );
});

