import dishesConst from './dishesConst.js';
import { assert, expect, should } from 'chai';
import makeModelProxyHandler from "./mockModel.js";
import getModule from "./filesToTest.js";
import testComponent from './testComponentTL.js';
import findCustomEvents from "./findCustomEvents.js";


const X= TEST_PREFIX;
const SidebarViewVue=(await getModule(`/src/views/${X}sidebarView.vue`))?.default ||
    (await getModule(`/src/views/${X}sidebarView.jsx`))?.default;
const SidebarView=(await getModule(`/src/views/${X}sidebarView.jsx`))?.default;
const SidebarVue= (await getModule(`/src/vuejs/${X}sidebarPresenter.jsx`))?.default;
const SidebarReact=(await getModule(`/src/reactjs/${X}sidebarPresenter.jsx`))?.default;

describe("TW1.5 Presenter handles custom events and changes Model [final TW1 test Vue](/tw1.5.2.html)[React](/tw1.5.2-react.html)", function tw1_5_20() {

    let latestGuests;
    testComponent({
        vue: SidebarVue,
        react: SidebarReact,
        mock: [{component: SidebarView, dummyText: "mock sidebar view"}]},
        {model: new Proxy({
            numberOfGuests: 2,
            dishes: [],
            setNumberOfGuests(x){latestGuests=x;}
            }, makeModelProxyHandler("Sidebar presenter, testing custom events"))},
        "$framework Sidebar presenter handles the onNumberChange custom event, changing the number of guests in the Model",
        function tw1_5_20_1(output, presenterProps, mockHandlers){
            expect(output.queryByText(/mock sidebar view/), "sidebar presenter must always render sidebar view").to.be.ok;
            expect(typeof mockHandlers[0]?.propsHistory[0]?.onNumberChange).to.equal("function");
            mockHandlers[0]?.propsHistory[0]?.onNumberChange(3);
            expect(latestGuests, "custom event should properly ask presenter to change guests").to.equal(3);
            mockHandlers[0]?.propsHistory[0]?.onNumberChange(5);
            expect(latestGuests, "custom event should properly ask presenter to change guests").to.equal(5);
        }
    );

    const dishes = dishesConst.dishes3;
    let latestCurrentDish, latestRemovedDish;
    testComponent({
        vue: SidebarVue,
        react: SidebarReact,
        mock: [{component: SidebarView, dummyText: "mock sidebar view"}]},
        {model: new Proxy({
            numberOfGuests:3,
            dishes,
            setCurrentDish(id){latestCurrentDish=id;},
            removeFromMenu(dish){latestRemovedDish=dish;}
            }, makeModelProxyHandler("Sidebar presenter, testing custom events 2"))},
        "$framework Sidebar presenter handles the apropriate custom event fired by the View, setting current dish in the Model",
        function tw1_5_20_2(output, presenterProps, mockHandlers){
            const setCurrent = findCustomEvents(SidebarView, {number:5, dishes:dishes})?.a[0]?.customEventName;
            expect(output.queryByText(/mock sidebar view/), "sidebar presenter must always render sidebar view").to.be.ok;
            expect(mockHandlers[0]?.propsHistory[0], "expecting sidebar presenter to pass props to SidebarView").to.be.ok;

            expect(mockHandlers[0]?.propsHistory[0][setCurrent], "custom event handler "+setCurrent+ " should be a function").to.be.a("function");
            mockHandlers[0].propsHistory[0][setCurrent](dishesConst.dishes3[2]);
            expect(latestCurrentDish,"custom event handler "+setCurrent+ " should set the current dish").to.equal(dishesConst.dishes3[2].id);
            expect(latestRemovedDish, "custom event handler "+setCurrent+" should not remove dish").to.be.undefined;
        }
    );

    let lastCurrentDish, lastRemovedDish;
    testComponent({
        vue: SidebarVue,
        react: SidebarReact,
        mock: [{component: SidebarView, dummyText: "mock sidebar view"}]},
        {model: new Proxy ({
            numberOfGuests: 3,
            dishes,
            setCurrentDish(id){lastCurrentDish=id;},
            removeFromMenu(dish){lastRemovedDish=dish;}
            }, makeModelProxyHandler("Sidebar presenter, testing custom events 3"))},
        "$framework Sidebar presenter handles the apropriate custom event fired by the View, removing the dish from the Model menu",
        function tw1_5_20_3(output, presenterProps, mockHandlers){
            const remove = findCustomEvents(SidebarView, {number:5, dishes:dishes})?.button[2]?.customEventName;
            
        expect(output.queryByText(/mock sidebar view/), "sidebar presenter must always render sidebar view").to.be.ok;

        expect(mockHandlers[0]?.propsHistory[0], "expecting sidebar presenter to pass props to SidebarView").to.be.ok;
        
        expect(mockHandlers[0]?.propsHistory[0][remove], "custom event handler "+remove+" should be a function").to.be.a("function");
        mockHandlers[0]?.propsHistory[0][remove](dishesConst.dishes3[1]);
        expect(lastRemovedDish,"custom event handler "+remove+" should remove a dish").to.deep.equal(dishesConst.dishes3[1]);
        expect(lastCurrentDish, "custom event handler "+remove+" should not set current dish").to.be.undefined;
        }
    );
});
