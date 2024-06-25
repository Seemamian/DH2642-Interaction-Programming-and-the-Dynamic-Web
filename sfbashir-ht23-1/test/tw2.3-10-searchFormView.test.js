import { expect } from "chai";
import getModule from "./filesToTest.js";
import testComponent from "./testComponentTL.js";
import findCustomEvents from "./findCustomEvents.js";
import { fireEvent } from "@testing-library/react";
import {h} from "vue/dist/vue.esm-bundler.js";
import * as vueTL from "./vtl/index.js";

const X= TEST_PREFIX;
const SearchFormView=(await getModule(`/src/views/${X}searchFormView.vue`))?.default ||
    (await getModule(`/src/views/${X}searchFormView.jsx`))?.default;

describe("TW2.3 rendering recap, fire custom events: SearchFormView [test Vue](/tw2.3.html)[React](/tw2.3-react.html)", function tw2_3_10() {
  this.timeout(200000); // increase to allow debugging during the test run


  testComponent(
    {vue: SearchFormView},
      [{dishTypeOptions: []}, {dishTypeOptions: ["someType"], text:"bla", type:"someType"}],
    "SearchFormView renders textbox, SELECT box and button, and uses its text and type props",
    function tw2_3_10_1(output, index){
        expect(output.queryAllByRole('textbox').length, "1 textbox expected").to.equal(1);
        expect(output.queryAllByRole('combobox').length, "Must only have 1 SELECT element").to.equal(1);
        expect(output.queryAllByRole("button").length, "there should be at least one button").to.be.gte(1);
        expect(output.queryByRole("button", {name: /search/i}), "the first button's text must include \"search\"").to.be.ok;

        expect(output.queryAllByRole('textbox')[0].value, "textbox value attribute must be the 'text' prop, or empty string if the prop is falsy").to.equal(index?"bla":"");
        expect(output.queryAllByRole('combobox')[0].value, "SELECT value attribute must be the 'type' prop, or empty string if the prop is falsy").to.equal(index?"someType":"");

    });  
  testComponent(
    {vue: SearchFormView},
    {dishTypeOptions: ["start", "main courze", "desser"]},
    "SearchFormView renders dishTypeOptions prop (array rendering)",
    function tw2_3_10_1(output, index){
      expect(output.queryAllByRole('combobox').length, "Must only have 1 SELECT element").to.equal(1);

      expect(output.queryByText(/Choose/), "Choose is rendered").to.be.ok;
      const options = output.queryAllByRole('option');
      expect(options.length, "4 options must be rendered").to.equal(4);

      let optionArr = [];
      options.forEach((option) => {
        optionArr = [...optionArr, option.textContent?.trim()]
      });

      // sort optionArr?? or maybe it should be in this order always, then do a hard check!
      expect(optionArr[0], "First option must be Choose:").to.equal("Choose:");
      expect(optionArr[1], "Second option must be the first array element").to.equal("start");
      expect(optionArr[2], "Third option must be the second array element").to.equal("main courze");
      expect(optionArr[3], "Fourth option must be the third array element").to.equal("desser");

    });

  testComponent({vue: SearchFormView},
    [{dishTypeOptions: ["starter", "main course", "dessert"]},
    {dishTypeOptions: ["primero", "segundo", "tercero", "cuarto"]}],
    "SearchFormView performs array rendering rather than repeating UI",
    function tw2_3_10_2_1(output, index){
      const options = output.queryAllByRole("option");
      expect(options[0].textContent, "First options must be 'Choose:'").to.equal("Choose:");
      expect(options.length, "Are all options from props rendered?").to.equal(index?5:4);
    });
  
  it("SearchFormView fires custom events on text or type change (send text, type as parameter), and on button press", function tw2_3_10_3(){
          if(!SearchFormView)
      this.skip();

    const customEvents = findCustomEvents(SearchFormView, {dishTypeOptions: ["starter", "main course", "dessert"]});
    const buttons = customEvents?.button.filter((button) => {return button.element.children[0].toLowerCase().startsWith("search");});
    const inputs = customEvents?.input;
    const selects = customEvents?.select;

    expect(buttons.length, "SearchFormview expected to have one search button").to.equal(1);
    expect(inputs.length, "SearchFormView expected to have one  input box").to.equal(1);
    expect(selects.length, "SearchFormView expected to have one  select box").to.equal(1);

    let dynamicPropOnType = selects[0]?.customEventName;
    let dynamicPropOnText = inputs[0]?.customEventName;
    let dynamicPropOnSearch = buttons[0]?.customEventName;
    
    let newType;
    let newText;
    let searched;
    
    // render without creating another it()
    window.React={createElement:h}
    const output= vueTL.render({
      components: {SearchFormView},
      template: "<SearchFormView/>"
    },{
      props: {
        dishTypeOptions: ["starteerr", "main course", "dessert"],
        [dynamicPropOnText]: function(text){newText=text;},
        [dynamicPropOnType]: function(type){newType=type;},
        [dynamicPropOnSearch]: function(){searched=true;}
      },
      container: document.createElement("div")
    });
    
    // gets the inputbox and the selectbox
    const input = output.queryByRole('textbox');
    const select = output.queryByRole('combobox');
    const button = output.queryAllByRole('button').filter((button) => {
      const buttonText = button.textContent.toLowerCase();
      return buttonText.includes('search')
    })[0];

    // Fires events on input and select
    fireEvent.change(input, {target: {value: "pizzza"}});
    fireEvent.change(select, {target: {value: "starteerr"}});
    fireEvent.click(button);
  
    // Expects that the values inputted should be the same sent as props to presenter
    expect(newText, "the text in the input box should send the same text as parameter").to.equal("pizzza");
    expect(newType, "the selected option should send the same option as parameter").to.equal("starteerr");
    expect(searched, "the search button should fire a custom event").to.equal(true);
  });

    it("SearchFormView does not change its props during rendering", function tw2_3_10_5() {
      if(!SearchFormView)
          this.skip();
      window.React= { createElement(){ return {}; }};
      const props = {dishTypeOptions:["starter", "main course", "dessert"]};
      const json = JSON.stringify(props);
      const rendering= SearchFormView(props);
      expect(JSON.stringify(props),"SearchFormView doesn't change its props during rendering").to.equal(json);
  });

});
