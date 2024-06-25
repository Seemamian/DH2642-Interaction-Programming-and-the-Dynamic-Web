import { expect } from 'chai';
import getModule from "./filesToTest.js";
import testComponent from "./testComponentTL.js";

const X= TEST_PREFIX;
const SummaryView=(await getModule(`/src/views/${X}summaryView.vue`))?.default ||
    (await getModule(`/src/views/${X}summaryView.jsx`))?.default;

const SidebarView=(await getModule(`/src/views/${X}sidebarView.vue`))?.default ||
    (await getModule(`/src/views/${X}sidebarView.jsx`))?.default;

describe("TW1.2 Basic Rendering", function tw1_2() {
    this.timeout(200000);

    testComponent(
        {vue: SidebarView},
        [{number:4, dishes:[]}, 
        {number:7, dishes:[]}],
        "SidebarView shows its number prop [test UI with Vue](/tw1.2.1.html)[or React](/tw1.2.1-react.html)",
        function tw1_2_2(output, index){
            const buttons = output.queryAllByRole('button');
            expect(buttons.length, "SidebarView should have only 2 buttons").to.be.equal(2);
            const minusButton = buttons.filter((button) => {return button.textContent.includes("-");})[0];
            const plusButton = buttons.filter((button) => {return button.textContent.includes("+");})[0];

            expect(minusButton.textContent, "SidebarView's first button should have text content '-'").to.be.equal("-");
            expect(plusButton.textContent, "SidebarView's second button should have text '+'").to.be.equal("+");

            expect(minusButton.disabled, "SidebarView's first button should be enabled").to.be.equal(false);
            expect(output.queryByText(index?7:4), "SidebarView should show its number prop").to.be.ok;
        }
    );

    testComponent(
        {vue: SidebarView},
        [{number:5, dishes:[]},
        {number:1, dishes:[]}],
        "SidebarView's minus button should be disabled if number prop is 1 [test UI with Vue](/tw1.2.1.html)[or React](/tw1.2.1-react.html)",
        function tw1_2_3(output, index){
            const buttons = output.queryAllByRole('button');
            expect(buttons.length, "SidebarView should have only 2 buttons").to.be.equal(2);
            const minusButton = buttons.filter((button) => {return button.textContent.includes("-");})[0];
            const plusButton = buttons.filter((button) => {return button.textContent.includes("+");})[0];

            expect(minusButton.textContent, "SidebarView's first button should have text content '-'").to.be.equal("-");
            expect(plusButton.textContent, "SidebarView's second button should have text '+'").to.be.equal("+");

            expect(buttons[0].disabled, "SidebarView's first button should be disabled when number of guests is 1").to.be.equal(Boolean(index));
            expect(output.queryByText(index?1:5), "SidebarView should show its number prop").to.be.ok;
        }
    );
    
    // These do not work with .vue since its not a function
    // The way they are implemented (by hijacking React.createElement) may create problems with vite plugins for React, Vue, SolidJS.
    // But we don't use these yet.
    it("SummaryView does not change its props during rendering", function tw1_2_2(){
        if(typeof SummaryView !="function") this.skip();
        window.React= { createElement(){ return {}; }};
        const props = {people: 4, ingredients: []};
        const json = JSON.stringify(props);
        const rendering= SummaryView(props);
        expect(JSON.stringify(props),"SummaryView doesn't change its props during render").to.equal(json);
    });

    it("SidebarView does not change its props during rendering", function tw1_2_5(){
        if(typeof SidebarView !="function") this.skip();
        window.React= { createElement(){ return {}; }};
        const props = {number: 4, dishes: []};
        const json = JSON.stringify(props);
        const rendering= SidebarView(props);
        expect(JSON.stringify(props),"SidebarView doesn't change its props during render").to.equal(json);
    });
});
