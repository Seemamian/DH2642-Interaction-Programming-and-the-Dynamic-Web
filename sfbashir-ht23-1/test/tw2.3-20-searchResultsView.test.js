import { expect } from "chai";
import testComponent from "./testComponentTL";
import getModule from "./filesToTest.js";
import findCustomEvents from "./findCustomEvents.js";
import { fireEvent } from "@testing-library/react";
import {h} from "vue/dist/vue.esm-bundler.js";
import * as vueTL from "./vtl/index.js";

const X= TEST_PREFIX;
const SearchResultsView=(await getModule(`/src/views/${X}searchResultsView.vue`))?.default ||
    (await getModule(`/src/views/${X}searchResultsView.jsx`))?.default;

describe("TW2.3 (array) rendering recap, fire custom events: SearchResultsView [test Vue](/tw2.3.1.html) [React](/tw2.3.1-react.html)", function tw2_3_20() {
  this.timeout(200000);

  const searchResults = [
    {
      id: 587203,
      title: "Taco Pizza",
      readyInMinutes: 20,
      servings: 6,
      sourceUrl: "https://laurenslatest.com/taco-salad-pizza-with-doritos/",
      openLicense: 0,
      image: "https://laurenslatest.com/wp-content/uploads/2020/12/Taco-Pizza-02-copy.jpg",
    },
    {
      id: 559251,
      title: "Breakfast Pizza",
      readyInMinutes: 25,
      servings: 6,
      sourceUrl: "http://www.jocooks.com/breakfast-2/breakfast-pizza/",
      openLicense: 0,
      image: "https://www.jocooks.com/wp-content/uploads/2012/04/breakfast-pizza-1-1.jpg",
    },
    {
      id: 556121,
      title: "Easy Vegetarian Sausage Basil Pizza",
      readyInMinutes: 30,
      servings: 4,
      sourceUrl: "https://dizzybusyandhungry.com/cashew-sausage-basil-pizza/",
      openLicense: 0,
      image: "https://dizzybusyandhungry.com/wp-content/uploads/2021/01/easy-vegetarian-sausage-basil-pizza-title-pin.jpg",
    },
  ];

  const searchResults2 = [
    {
      id: 587203,
      title: "Taco Pizza",
      readyInMinutes: 20,
      servings: 6,
      sourceUrl: "https://laurenslatest.com/taco-salad-pizza-with-doritos/",
      openLicense: 0,
      image: "https://laurenslatest.com/wp-content/uploads/2020/12/Taco-Pizza-02-copy.jpg",
    },
    {
      id: 559251,
      title: "Breakfast Pizza",
      readyInMinutes: 25,
      servings: 6,
      sourceUrl: "http://www.jocooks.com/breakfast-2/breakfast-pizza/",
      openLicense: 0,
      image: "https://www.jocooks.com/wp-content/uploads/2012/04/breakfast-pizza-1-1.jpg",
    },
  ]

  // test case can be removed
  // checking for root DIV????

  // testComponent({vue: SearchResultsView},
  //   [{searchResults: searchResults}],
  //   "SearchResultsView renders a root DIV",
  //   function tw2_3_20_1(output, index){
  //     expect(output.container, "A DIV tag was expected").to.be.ok;
  //     expect(output.container.localName, "A DIV tag was expected").to.equal("div");
  //   });


  // test case can be removed
  // searching for spans??? 

  // testComponent({vue: SearchResultsView},
  //   [{searchResults: searchResults}],
  //   "SearchResultsView renders a SPAN for each search result",
  //   function tw2_3_20_2(output, index){

  //     // span doesnt have a searchable role in TL, so each img parentElement should be the span
  //     const spans = output.queryAllByRole('img').map((x)=>{return x.parentElement});
    
  //     expect(spans, "SearchResultView should generate a tree").to.be.ok;
  //     expect(spans.length, "SearchResultsView should render the same amount children as the number of dishes it got").to.equal(3);
  //     spans.forEach((span)=>{
  //       expect(span.localName, "Does your search results generate a span for each dish in search result?").to.equal("span");
  //     });
  //   });

  testComponent({vue: SearchResultsView},
    [{searchResults: searchResults2},
      {searchResults: searchResults}],
    "SearchResultsView performs array rendering to display search results i.e. the dish image and dish name",
    function tw2_3_20_4(output, index){
      const images = output.queryAllByRole('img');

      if (!index) {
        searchResults2.forEach((dish) => {
          const title = output.queryByText(dish.title);
          expect(title, "SearchResultsView should render the titles for each dish").to.be.ok;
        });
      } else {
        searchResults.forEach((dish) => {
          const title = output.queryByText(dish.title);
          expect(title, "SearchResultsView should render the titles for each dish").to.be.ok;
        });
      }
      
      expect(images.length, "SearchResultsView should render the same amount of images as the number of dishes it got").to.equal(index?searchResults.length:searchResults2.length);
    });

    //basically the same test as above, so can be removed
  // testComponent({vue: SearchResultsView},
  //   [{searchResults: searchResults2},
  //     {searchResults: searchResults}],
  //   "SearchResultsView performs array rendering to display search results",
  //   function tw2_3_20_3(output, index){
  //     const spans = output.queryAllByRole('img').map((x)=>{return x.parentElement});
      
  //     expect(spans, "SearchResultView should generate a tree").to.be.ok;
  //     expect(spans.length, "SearchResultsView accepts a variable length of searchResults").to.equal(index?searchResults.length:searchResults2.length);
  //   });

  
  testComponent({vue: SearchResultsView},
    [{searchResults: searchResults}],
    "SearchResultsView renders images with required attributes",
    function tw2_3_20_5(output, index){
      const images = output.queryAllByRole('img');
      images.forEach((img, i) => {
        expect(img?.__vnode?.props, "image expected to have attributes").to.be.ok;
        expect(img?.__vnode?.props?.src, "Ensure that the image src is the correct path to the image from spoonacular").to.equal(searchResults[i].image);
        expect(img?.__vnode?.props?.height, "Image height must be 100").to.equal("100");
      });
    });


  // same as other test above, checking for titles to be rendered
  // testComponent({vue: SearchResultsView},
  //   [{searchResults: searchResults}],
  //   "SearchResultsView renders dish names in the DOM tree as required",
  //   function tw2_3_20_6(output, index){
  //     const spanChildren = output.queryAllByRole('img').map((x)=>{return x.parentElement.children});
  //     spanChildren.forEach((child, i) => {
  //       let title = child[1]?.__vnode;
  //       expect(title.children).to.be.ok;
  //       expect(title.children.trim(),"expecting DIV to have a single (text) child, no extra spaces allowed").to.equal(title.children);
  //       expect(title.children,"Dish name: the 'title' property must be accessed from the dish object").to.equal(searchResults[i].title);
  //     });
  //   });

  it("SearchResultsView fires custom event on dish click, send search result as parameter", function tw2_3_20_7(){
    if(!SearchResultsView)
      this.skip();

    const spans = findCustomEvents(SearchResultsView, {searchResults: searchResults}).span;
    let dynamicPropOnChosenDish;

    expect(spans.length, "SearchResultsView with three results should contain three spans with click handlers").to.equal(3);

    spans.forEach((span, i) => {
      expect(span.customEventName, "expected custom event name").to.be.ok;
      expect(span.customEventParams, "expected event param").to.be.ok;
      expect(span.customEventParams[0], "expected params to equal the selected dish object").to.equal(searchResults[i]);
      dynamicPropOnChosenDish = span.customEventName;
    });

    let newDish;

    window.React={createElement:h}
    const output= vueTL.render({
      components: {SearchResultsView},
      template: "<SearchResultsView/>"
    },{
      props: {
        searchResults: searchResults, 
        [dynamicPropOnChosenDish]: function(dish){newDish=dish;}
      },
      container: document.createElement("div")
    });

    const spans2 = output.queryAllByRole('img').map((x)=>{return x.parentElement});
    spans2.forEach((span, i) => {
      fireEvent.click(span);
      expect(newDish, "clicking a span should send correct dish as parameter").to.deep.equal(searchResults[i]);
      newDish = undefined;
    });
  });

  it("SearchResultsView does not change its props during rendering", function  tw2_3_20_9() {
    if(!SearchResultsView)
        this.skip();
    const props = {searchResults: searchResults};
    const json = JSON.stringify(props);
    window.React= { createElement(){ return {}; }};
    const rendering= SearchResultsView(props);
    expect(JSON.stringify(props),"SearchResultsView doesn't change its props during render").to.equal(json);
  });
});
