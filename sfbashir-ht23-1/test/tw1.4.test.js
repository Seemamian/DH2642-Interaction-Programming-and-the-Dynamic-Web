import { expect} from 'chai';
import getModule from "./filesToTest.js";
import testComponent from "./testComponentTL.js";
import { fireEvent } from '@testing-library/react';
import findCustomEvents from "./findCustomEvents.js";
import {dishInformation} from "./mockFetch.js";


const X= TEST_PREFIX;
const SidebarView=(await getModule(`/src/views/${X}sidebarView.jsx`))?.default
// const SidebarView=(await getModule(`/src/views/${X}sidebarView.vue`))?.default ||
//     (await getModule(`/src/views/${X}sidebarView.jsx`))?.default;



describe("TW1.4 Handle native events, fire custom events [test events with Vue](/tw1.4.html)[or React](/tw1.4-react.html)", function tw1_4() {
    this.timeout(200000);  // increase to allow debugging during the test run

    testComponent({vue: SidebarView},
        [{number:4, dishes:[]},
        {number:7, dishes:[]}],
        "SidebarView handles native events (click) on the - and + buttons",
        function tw1_4_1(output, index){
            const buttons = output.queryAllByRole('button');

            expect(buttons.length, "2 buttons expected if no dishes").to.equal(2);
            expect(buttons[0].__vnode?.props?.onClick, "onClick listener for - button must be a function (recommendation: initially log the number minus one)").to.be.a("Function");
            expect(buttons[1].__vnode?.props?.onClick, "onClick listener for + button must be a function (recommendation: initially log the number plus one)").to.be.a("Function");
            expect(buttons[0].__vnode?.props?.onClick,  "onClick listener + and - buttons must be different, because they do different things").to.not.equal(buttons[1].__vnode?.props?.onClick);
       });

    let newNumber;
    testComponent({vue: SidebarView},
        [{number:4, dishes:[], onNumberChange:function(nr){newNumber=nr;}},
        {number:7, dishes:[], onNumberChange:function(nr){newNumber=nr;}}],
        "click on + or - buttons fire the  onNumberChange custom event with the desired number as parameter",
        function tw1_4_2(output, index){
            const buttons = output.queryAllByRole('button');
            expect(buttons.length, "2 buttons expected if no dishes").to.equal(2);

            fireEvent.click(buttons[0]);
            expect(newNumber, "clicking the - button must fire the onNumberChange custom event with the new number value as parameter").to.equal(index?6:3);
        
            fireEvent.click(buttons[1]);
            expect(newNumber, "clicking the + button must fire the onNumberChange custom event with the new number value as parameter").to.equal(index?8:5);
        });


    const dishes = [dishInformation, {...dishInformation, id:42}, {...dishInformation, id:43}];
    const dishes2 = [dishInformation, {...dishInformation, id:42}];

    testComponent({vue: SidebarView},
        [{number:4, dishes:dishes},
        {number:3, dishes:dishes2}],
        "SidebarView detects (native) click event on dish link",
        function tw1_4_3(output, index){
            const links = output.queryAllByRole('link');

            expect(links.length, "A link expected for each dish").to.equal(index?dishes2.length:dishes.length);

            expect(links[0].__vnode?.props?.onClick, "onClick listener for dish links must be a function (recommendation: log the dish initially)").to.be.a("Function");
            expect(links[1].__vnode?.props?.onClick, "onClick listener for dish links must be a function (recommendation: log the dish initially)").to.be.a("Function");
            expect(links[0].__vnode?.props?.onClick,  "onClick listener for dish links must be a differnt function for each dish (define a CB nested in the array rendering CB)").to.not.equal(links[1].__vnode?.props?.onClick);
        });


    let linkCustomEventName;
    testComponent({vue: SidebarView},
        [{number:5, dishes:dishes}],
        "click on dish link fires a custom event and passes the dish object as parameter",
        function tw1_4_4(output, index){
            const links = findCustomEvents(SidebarView, {number:5, dishes:dishes}).a;

            expect(links.length, "3 links expected for 3 dishes").to.equal(3);

            const [currentName1, currentName2, currentName3] = links.map((event) => {return event.customEventName});
            const [currentParam1, currentParam2, currentParam3] = links.map((event) => {return event.customEventParams});

            expect(currentName1, "custom events fired by all links should have the same name").to.equal(currentName2);
            expect(currentName2, "custom events fired by all links should have the same name").to.equal(currentName3);
        
            expect(currentParam1.length, "expected custom event "+currentName1+" to be fired with one parameter").to.equal(1);
            expect(currentParam1[0], "expected custom event "+currentName1+" fired on the first link to have the first dish as parameter").to.deep.equal(dishInformation);
            expect(currentParam2[0], "expected custom event "+currentName1+" fired on the second link to have the second dish as parameter").to.deep.equal(dishes[1]);
        
            linkCustomEventName = currentName1;
        });

    testComponent({vue: SidebarView},
        [{number:4, dishes:dishes},
        {number:7, dishes:dishes2}],
        "SidebarView detects (native) click event on dish link",
        function tw1_4_5(output, index){
            const buttons = output.queryAllByRole('button');

            expect(buttons.length, "Expected there to be 2 buttons for + and -, as well as a button for each dish").to.equal(index?4:5);
        
            expect(buttons[2].__vnode?.props?.onClick, "onClick listener for dish X button must be a function (recommendation: log the dish for )").to.be.a("Function");
            expect(buttons[3].__vnode?.props?.onClick, "onClick listener for dish X button must be a function (recommendation: log the dish initially)").to.be.a("Function");
            expect(buttons[2].__vnode?.props?.onClick,  "onClick listener for dish X buttons must be a differnt function for each dish (define a CB nested in the array rendering CB)").to.not.equal(buttons[3].props?.onClick);
        });

    testComponent({vue: SidebarView},
        [{number:5, dishes:dishes}],
        "click on dish X button fires a custom event and passes the dish object as parameter",
        function tw1_4_6(output, index){
            const [minusButton, plusButton, ...buttons] = findCustomEvents(SidebarView, {number:5, dishes:dishes}).button;
            expect(buttons.length, "3 x buttons expected for 3 dishes").to.equal(3);

            const [currentName1, currentName2, currentName3] = buttons.map((event) => {return event.customEventName});
            const [currentParam1, currentParam2, currentParam3] = buttons.map((event) => {return event.customEventParams});

            expect(currentName1, "custom events fired by all links should have the same name").to.equal(currentName2);
            expect(currentName2, "custom events fired by all links should have the same name").to.equal(currentName3);
        
            expect(currentParam1.length, "expected custom event "+currentName1+" to be fired with one parameter").to.equal(1);
            expect(currentParam1[0], "expected custom event "+currentName1+" fired on the first link to have the first dish as parameter").to.deep.equal(dishInformation);
            expect(currentParam2[0], "expected custom event "+currentName1+" fired on the second link to have the second dish as parameter").to.deep.equal(dishes[1]);

            expect(currentName1, "custom event fired on clicking X button should be different from the custom event fired on clicking dish link").to.not.equal(linkCustomEventName);
        });
});
