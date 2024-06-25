import { expect } from "chai";
import {dishInformation} from "./mockFetch.js";
import testComponent from "./testComponentTL.js";
import getModule from "./filesToTest.js";
import findCustomEvents from "./findCustomEvents.js";
import { fireEvent } from "@testing-library/react";
import {h} from "vue/dist/vue.esm-bundler.js";
import * as vueTL from "./vtl/index.js";


const X= TEST_PREFIX;
const DetailsView=(await getModule(`/src/views/${X}detailsView.vue`))?.default ||
    (await getModule(`/src/views/${X}detailsView.jsx`))?.default;

describe("TW2.3 Free rendering, fire custom events. Work with stacktraces: DetailsView [test Vue](/tw2.3.2.html) [React](/tw2.3.2-react.html)", function tw2_3_30() {
  this.timeout(200000);

  let guests = 3;
  let disabled = true;
    

    testComponent({vue: DetailsView},
        [{dishData:dishInformation,guests:guests,isDishInMenu:{disabled}}],

        "DetailsView renders dish price _and_ dish price for all guests",
        function tw2_3_30_1(output, index){
            // queryAllByText needs a Regular Expression to be able to search the document.
            const price = new RegExp(dishInformation.pricePerServing);
            const priceForGuests = new RegExp(dishInformation.pricePerServing * guests);

            
            expect(output.queryByText(price).length, 
                "The price of the dish is not rendered. Check the stacktrace to find what the test is searching for."
                ).to.not.equal(0);

            expect(output.queryAllByText(priceForGuests).length, 
                "pricePerServings should be also shown multiplied by the number of guests. Check the stacktrace to examine the test!"
                ).to.not.equal(0);
        },

        "DetailsView renders all ingredients (name, amount, measurement unit).",
        function tw2_3_30_2(output, index){
            dishInformation["extendedIngredients"].forEach((ingredient) => {
                expect(output.queryAllByText(new RegExp(ingredient.name)).length, 
                    "ingredient names must be displayed. Could not find: "+ingredient["name"]+" Check the stacktrace to find what the test is searching for"
                    ).to.not.equal(0);

                expect(output.queryAllByText(new RegExp(ingredient["unit"])).length, 
                    "Measurement units are not showing. Could not find: "+ingredient["unit"]+ " for ingredient "+ingredient["name"]+" Check the stacktrace to find what the test is searching for"
                    ).to.not.equal(0);

                expect(output.queryAllByText(new RegExp(ingredient["amount"])).length, 
                    "Ingredient amount not found: "+  ingredient["amount"] +" for ingredient "+ingredient["name"]+ " . Ingredient amounts do not need to be multiplied by number of guests."
                    ).to.not.equal(0);
            });
        },

        "DetailsView renders cooking instructions",
        function tw2_3_30_3(output, index){
            expect(output.queryAllByText(new RegExp(dishInformation.instructions.slice(30, 100))).length,
                "Cooking instructions not found. Check the stacktrace to find what the test is searching for."
                ).to.not.equal(0);
        },
        
        "DetailsView has link to recipe",
        function tw2_3_30_4(output, index){
            expect(output.queryAllByRole('link').length,
                "link to original recipe not found.  Check the stacktrace to find what the test is searching for."
                ).to.not.equal(0);

            expect(output.queryAllByRole('link')[0].href, 
                "expected link to be link to the origianl recipe"
                ).to.equal(dishInformation["sourceUrl"])
        },
        
        "DetailsView renders dish image",
        function tw2_3_30_5(output, index){
            expect(output.queryAllByRole('img').length,
                "image of the dish was not found. Check the stacktrace to find what the test is searching for."
                ).to.not.equal(0);
        },
        
        "DetailsView has button to add to menu, disabled if dish is in menu",
        function tw2_3_30_5(output, index){
            const buttons = output.queryAllByRole('button');
            let addToMenuButton;
            buttons.forEach(button => {
                if (
                    (button?.textContent?.toLowerCase().includes("add") ||
                    button?.textContent?.toLowerCase().includes("menu"))
                ) {
                    addToMenuButton = button;
                }
            });
            expect(addToMenuButton, "add to menu button not found, looking for a button with label that contains 'add' and 'menu'").to.be.ok;
            expect(addToMenuButton.__vnode.props.disabled.disabled, "'Add to menu' button must be disabled if the dish is already in the menu").to.equal(disabled);
        });

    it("DetailsView 'add to menu' button fires a custom event", function tw2_3_20_7(){
        if(!DetailsView)
            this.skip();

        let dynamicPropOnAddToMenu
        let addedDish;
        const buttonsCE = findCustomEvents(DetailsView, {dishData:dishInformation, isDishInMenu:true, guests:6}).button;
        dynamicPropOnAddToMenu = buttonsCE.filter((button)=>{return button.customEventName})[0].customEventName;

        window.React={createElement:h}
         const output= vueTL.render({
            components: {DetailsView},
            template: "<DetailsView/>"
         },{
            props: {
                dishData:dishInformation,
                isDishInMenu:true,
                guests:6,
                [dynamicPropOnAddToMenu]: function(){addedDish=true;}
            },
            container: document.createElement("div")
        });
        const button = output.queryAllByRole('button').filter((button) => {
            const buttonText = button.textContent.toLowerCase();
            return buttonText.includes('add') || buttonText.includes('menu');
        })[0];

        fireEvent.click(button);
        expect(addedDish, "the add to menu button should fire a custom event").to.equal(true);
    });

    it("DetailsView does not change its props during rendering", function tw2_3_30_8() {
        if(!DetailsView)
            this.skip();
        
        const props = {dishData: dishInformation, guests: guests, isDishInMenu: disabled};
        const json = JSON.stringify(props);
        window.React= { createElement(){ return {}; }};
        DetailsView(props);
        expect(JSON.stringify(props),"DetailsView doesn't change its props during render").to.equal(json);
    });
});
