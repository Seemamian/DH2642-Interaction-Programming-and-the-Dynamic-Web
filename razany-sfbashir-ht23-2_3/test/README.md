# How to run tests with various frameworks

## Vue and Vue Testing Library

```
import {h} from "vue/dist/vue.esm-bundler.js";
import * as vueTL from "./vtl/index.js";
```

`vue.esm-bundler` is used in order to be able to render vue templates, which are required by the Vue test-utils (you cannot test JSX directly)

`vue-testing-library` is imported locally ( `./vtl` ) because for whatever reason the npm package `@testing-library/vue` does not work in a browser environment (only works in command line testing, i.e. jsdom)

### rendering a Vue component for testing
```
it("should blabla", function someNameACB(){
   window.React={createElement:h}
   const output= vueTL.render({
      components: { TheComponent },
      template: "<TheComponent/>"
   },{
     props:{ prop1:value1, props2:value2},
     container: document.createElement("div")
   });
   frameworkNeutralTest(output);
}
```


##  React and React Testing Library

```
import {createElement} from "react";
import * as reactTL from "@testing-library/react";
```

NB: React was updated to version 18 in the Tutorial environment. This means that many existing tests warn about the React app not being bootstrapped correctly. These warnings should go away when we are done adopting Testing-Library.

### rendering a React component for testing
```
it("should blabla", function someNameACB(){
   window.React={createElement};
   const output = reactTL.render(createElement(TheComponent, { prop1:value1, props2:value2}, {
     container: document.creaetElement("div")
   });  
   frameworkNeutralTest(output)
}
```

# Where is test rendering done? (test container)

As shown above, we render in memory (not in the browser page). 

The problem with rendering in memory is that CSS does not apply unless the element is in the browser DOM, so we would not be able to test CSS. To fix that, simply
- append a DIV to document.getElementById("rendering"). It is a hidden div at the end of the HTML, defined in vite.config.js
- in that DIV, append the output generated above
- alternatively, JSDOM could be used, it may support CSS

# A word about JSX
Tests are written in JS, not JSX. We could change the extension but it's not worth the effort. If you want to create UI in the test, instead of
```<TheComponent prop1={value1} prop2={value2}> children </TheComponent>```   you need to write

```createElement(TheComponent, {prop1:value1, prop2:value2}, children);``` 

Where `createElement` is either `React.createElement` or `Vue.h` (the so-called JSX element creator). As shown above, this function is set to `window.React.createELement`, which is needed because React is not explicitly imported in JSX files, and by default Babel generates calls to `React.createElement`. This is good for us, as it allows us to switch the framework.

`children` (an array) can be made by using `createElement` function to create each child. Or a child can be just a string, number etc.

# Test runner: Mocha, running at the browser
When looking up Testing-Library examples you may find pages using Jest or Vitest. For historical reasons we use Mocha as a test runner, and Chai as assertion library. This may change in the future.

Another peculiarity of the DH2642 tests is that they run in the browser. This is for several reasons
- we want students to look at the Console, and use the stacktraces found there. Displaying the stacktrace in the browser console uses mocha-specific code.
- we want students to click on the manual test links, not just blidnly use automatic tests. Displaying links to manual tests uses mocha-specific code.

However it may be possible with testing-library to get the tests to run at the Console on "npm test" etc.

Test results are saved in a database. Getting the results also uses mocha-specific code.

All of the special code above is in `test/index.js`

# Checking whether a modules exists
Unlike a typical software product, in the lab students can choose to define a certain file. Therefore the tests need to check whether these files exist.
Using static import will lead to a vite error, so dynamic imports are used. We wrote a simple helper called `filesToTest` which exports the utility `getModule`

Also, in order to avoid committing solutions to git, we look for a prefix. For example solved-summaryView.jsx will contain the Summary View solution.
If one solved-file exists, only solved files are checked (this is checked in `vite.config.js`)

```
import getModule from "./filesToTest.js";

const X= TEST_PREFIX;
const SummaryViewJSX=(await getModule(`/src/views/${X}summaryView.jsx`))?.default;
```

# Custom event names
Unlike a typical software product, in the lab students must choose their custom event names. In order to test Views and especially Presenters, we need to figure out what is the custom event name.

If custom events are correctly fired when producing a native event (button, link or span click, input on textbox or selection box) then we can find out the name of the custom event by wrapping the props into a `Proxy`. If firing the native event leads to accessign `props.someFunction` then `someFunction` is the custom event name.


```
import findCustomEvents from "./findCustomEvents.js";
import  {searchResults} from "./mockFetch.js";   // this will need to move!

...


 console.log(findCustomEvents(
            SearchFormView,  {dishTypeOptions:['starter', 'main course', 'dessert']}
            ));

 console.log(findCustomEvents(
     SidebarViewJSX,  {number:5, dishes:[ getDishDetails(1), getDishDetails(100)] }
     ));

 console.log(findCustomEvents(
            SearchResultsView, {searchResults}
            ));
```

`findCustomEvents(component, props)` returns an object with the the attributes `a, button, input, select, span`. They are the elements of the respective type found in the View. Each of them is an array of objects with the following structure:
- `element`: a JSX description of the element. The children attribute may be interesting e.g. for the button labels, or <a> (link) text
- `customEventName` the name of thhe custom event fired by the element. `null` if none is found
- `customEventParams`: the parameters (array, empty if no params) of the custom event.  For example for number:5, onNumberChange will have parameter 4 for the first button (-), and 6 for the second (+). `null` if no custom event is found is found. For INPUTS the (input or change) event is generated with the content "dummy text". For SELECTS the (input or change) event is generated with the content "dummy choice".
- `nativeEventName`: the name of the native event which leads to the custom event (if any). `a` and `button` are supposed to define `onClick`, while `input` and `select` are expected to define `onInput` or `onChange` 


# Mocking Components 
When we test a Presenter, we would like to avoid loading its view, in order to make sure that whatever error we find is in the Presenter not in the View.

The presenter test only checks
- that the correct View was indeed rendered
- that it was rendered with correct props

For that, we load a *mock* view, which simply renders something dummy and registers its props, so we can check them. The props remain undefined if the view was not rendered.

NB: some testing software, including Testing-Library advice against mocking. But others go a long way to support mocking, for example Vitest. Unfortunately Vitest mocking does not work in the browser, so we cannot adopt Vitest (instead of Mocha) in the lab for now.

Currently the lab mocking is based on using a special `React.createElement(component, props, children)` function (see JSX above), which will simply return a dummy if the `component` is the one we want to mock. 

Here we mock the `SidebarView` when rendering the React `Sidebar` presenter
```
import mockComponent from "./mockComponent.js";

...

        after(reactTL.cleanup);
        
        window.React={createElement};
        // mockComponent must always be called after window.React.createElement has been set, either for React or for Vue.
        // mockComponent must be called before the first render in the test.
        
        const mock=mockComponent(SidebarViewJSX, "mock sidebar");
        
        const output = reactTL.render(createElement(
            Sidebar,  {model: new Proxy({numberOfGuests:2, dishes:[]} ,   makeModelProxyHandler("Sidebar presenter"))}
        ),
                                         {
                                             container: document.createElement("div");
                                          });
       output.debug();
       console.log(mock);
```

The value returned by mockComponent is an object object contains the props history, one array element for the props of each View rendering.

NB:  mockComponent changes window.React.createElement. The mock object has a `close()` method which restores it, and normally it should be called in after(). However, since most JSX tests start with resetting window.React.createElement, it will work without calling close()

You can mock two views, which is needed for the Search presenter:
```
  window.React={createElement};
  const mock1=mockComponent(SearchFormView, "mock search form");
  const mock2=mockComponent(SearchResultsView, "mock search results");

  // had to do quite some model mocking here as well, but this is not so relevant for the view mocking example
  const output = reactTL.render(createElement(
      Search,  {model: new Proxy({numberOfGuests:2, dishes:[], doSearch(){}, searchResultsPromiseState: {promise: "bla", data:searchResults}, searchParams:{}} ,
                       makeModelProxyHandler("Search presenter"))}
        ),
                                     {
                                           container: document.createElement("div");
                                     });

   output.debug();
   console.log(mock1, mock2);
```

# testComponent: does all of the above
testComponent lets you test
- a given componenet for each framework, or just one framework
- with one or more set of props
- with one ore more mocked sub-components (views)
- apply to the above one or more framework neutral test(s)



The following will test a component with a given set of props, with Vue. It will generate the `it(  ... ) ` test description, so you don't have to do that!
```
import testComponent from "./testComponentTL.js";
const SummaryView= (await getModule(`/src/views/${X}summaryView.jsx`))?.default;

...

describe("SummaryView tests", function someName(){ 
testComponent({vue:SummaryView},
              { people:5, ingredients:[]},
              "Vue test of summary", function frameworkNeutralTestCB(output, propsIndex){   expect(...) }
            );

...  // more calls to testComponent here!
});
```
Note that if any of the components (SummaryView above) is falsy (not defined yet), the test will be shown as disabled (blue)

But maybe we want to test it with more props examples. In that case, the props will be an array. Note that the props index is passed to the framework-neutral test function, so it can check the output against the respective props. Note: props themselves are not passed, so the programmer is forced to use constants rather than `props.propName`, which would somewhat reimplement the component and thus may give students a hint how to do their work.

Please test each component (both views and presenters) with at least two sets of props. If a prop is an array, it should have different lengths!

```
testComponent({vue:SummaryView},
              [{ people:5, ingredients:[]}, { people:3, ingredients:[]}],
              "Vue test of summary", function frameworkNeutralTestCB(output, propsIndex){   expect(...) }
              )
```

Now we may want to test with React as well. The component tested is the same for Views, but that will not be the case for Presenters! Now the human-readable text description can expand $framework.

NB: it may be that the tests for the two frameworks are slightly different. In that case, you can simply use the form above!

```
testComponent({vue:SummaryView, react:SummaryView},
              [{ people:5, ingredients:[]}, { people:3, ingredients:[]}],
              "$framework test of summary", function frameworkNeutralTestCB(output, propsÌndex){   expect(...) }
              )
```

Say that we want to perform several tests on this setup, for all the given frameworks, for all the given sets of props! Simply add two more parameters (test description and framework-neutral test function)

```
testComponent({vue:SummaryView, react:SummaryView},
              [{ people:5, ingredients:[]}, { people:3, ingredients:[]}],
              "$framework test of summary", function frameworkNeutralTestCB(output, propsIndex){   expect(...) },
              "$framework second test of summary", function anotherFrameworkNeutralTestCB(output, propsIndex){   expect(...) }       
              )
```

In the component description we can also add components (views) to be mocked! The framework neutral test function will get the mock handlers so the propsHistory of the view is available.

Note that if any of the components is falsy (not defined for the respective framework), the test will be shown as disabled (blue)

```
const VueSidebarPresenter= (await getModule(`/src/vuejs/${X}sidebarPresenter.jsx`))?.default;
const ReactSidebarPresenter= (await getModule(`/src/reactjs/${X}sidebarPresenter.jsx`))?.default;
const SummaryView= (await getModule(`/src/views/${X}summaryView.jsx`))?.default;

...

testComponent({  vue:VueSidebarPresenter,
                 react:ReactSidebarPresenter,
                 mock: [ {  component: SidebarView, dummyText: "mock sidebar view"} ]
               },
              {model: new Proxy({numberOfGuests:2, dishes:[]} ,   makeModelProxyHandler("Sidebar presenter"))}, 
              "$framework Sidebar presenter passes correct props", function sidebarTestCB(output, presenterPropsIndex, mockHandlers){
                    expect(output.queryByText("mock sidebar view"), "sidebar presenter must always render sidebar view").to.be.ok; 
                    expect(mockHandlers[0]?.propsHistory[0]?.number).to.equal(2, "the number prop passed to the sidebar view must be the same as the model number of guests");
                }     
              )
```

- `mockHandlers[0]` will give the handler of the first (and only) mocked component, i.e. the SidebarView`. An array is needed because presenters like Search will have several View mocks.
- `propsHistory[0]` is the props passed to the SidebarView in the first rendering
- `propsHistory[0].number` is the number prop passed to SidebarView at the first rendering

If the model would be reactive, changing the model would lead to presenter re-render, i.e. the SidebarView would render again, which would add one more element to the props history. However in that case the props will differ for React and Vue because making the model reactive differs, thus we'd have two separate `testComponent()` calls. We may want to add a testComponent feature for this.

You can get **access to the mocha test** with the fourth callback parameter (we could call it `test`). Then you can skip the test if needed: `test.skip()` or you can change its name: `test._runnable.title=.. ` 

#async testComponent
If you need your test to be async, you need to use asyncTestComponent instead of testComponent

# Mocking fetch()
We do not want our tests to make network accesses. So we need to temporarily set window.fetch() to something that does not hit the network. After the test, teh native browser fetch() should of course be restored!

TODO: currently the lab tests use a custom solution for this. That must be replaced with some well-known library (just as we do with Testing-Library)

# firebase mocking
We of course do not want our test to save in firebase. Firebase does not use fetch() but web sockets. Again we currently have a custom solution for this, and as we are in the business of eliminating custom solutions, we should look for a replacement.


# Model mocking
In many tests we do not expect students to use more than a couple of model attributes or methods. We also do not want tests to work with the student DinnerModel because then the errors in that would propagate in the Presenter tests.

Model mocking is done with:
```
import makeModelProxyHandler from "./mockModel.js";
...

new Proxy({numberOfGuests:2, dishes:[]} ,   makeModelProxyHandler("Sidebar presenter"))
```

In this case we expect that the Presenter we sent this mock model to will only use `numberOfGuests` and `dishes` and no other model attributes.

# How to work on tests
- Back up the npm_tutorial src (e.g. src.bak)
- Move/copy into src your code, a colleague's code (that is known to work in the main or the vite branches), or the reference implementation src
- Never commit from src!!!

Always have a second parameter in `expect(x, secondParameter).to.blabla`. The second parameter tells the student in natural language what the test checks for.

When transforming tests (e.g. when introducing testing-library) make sure to copy the second parameter. Sometimes the second parameter is in the equal part: `expect(x).to.equal(y, explanation)`

All callbacks in tests must have names. describe(string, callback) and it(string, callback) should always be like `it(string, function tw1.5_12_1(){...})` . This is important for the same reason that we ask the students to have function names: to easier locate the test code that produces a stacktrace. And such test functions are prone to produce stacktraces!

# Multi-framework tests
```
it("Vue check that searchPresenter does X", function tw2.1_12_Vue(){
   // disable the test if the Vue presenter does not exist
  ...
  tw2.1_12(output);
})

it("React check that searchPresenter does X", function tw2.1_12_React(){
   // disable the test if the React presenter does not exist
  ...
  tw2.1_12(output);
})

function tw2.1_12(output){
    // this is the framework-neutral test
}
```

Currently code that is common between Vue and React tests is placed into separate modules like sidebarUtils, searchUtils, detailsUtils. To simplify the module structure, we will have a certain test in the same module for all frameworks, and call into standalone functions visible in that module, like tw2.1_12() above. Make sure to move all expects() from *utils.js into functions like tw2.1_12

The same applies to Views, even if we only test them with Vue (because Vue is stricter in the sense that it does not accept `className` for css, only `class`). Isolate the Vue dependent code in the it() callback, and move the rest into a framework-neutral function. In the future we may test JSX views with React, Solid, Preact...

Important: in principle all imports from old course utilities like *Utils, jsxUtilities should disappear. What remains:
- getModule
- findCustomEvents
- mockComponent
- mockModel
- example data (currently in dishesConst and mockFetch, the latter needs to be moved, I think dishesConst is ok for that)

# Tests and errors
- the only errors thrown by tests should be the errors thrown by Chai expect(), assert(), fail() etc
- tests must never throw runtime errors (cannot read X of undefined, Y is not a function). To avoid the classical runtime errors, instead of `object.attribute.attr2.attr3`  use the `?.` operator: `object?.attribute?.atttr2?.attr3` .  Or for functions that may be undefined `object?.attribute?.atttr2?.func?.(params)`
- errors in tests are confusing to the students because, even if the original issue may be in student code, the test should check for the issue with an expect() and the fact that we get a  runtime error means typically that tehre's a missing expect()
- beware! testing-library getByRole() and other utilities throw. Do not use them! Use alternatives that don't throw. Use queryByRole instead!


# Test testing ;)
- always test your tests with **several** `src/` (your code, reference implementation, 2-3 colleagues)
- do not only check if the test passes. Mutate the code in `src/` to check if the test fails!  Do that for every `src/` that you test with.
- any `src/` or mutated `src/` may lead to a runtime error in a test. Fix it! You will typically add an expect() in such cases

# Testing-library and Chai

You may find that Jest or vitest examples such as `expect(getByRole()).toBeInDocument()` do not work with Chai.

First of all, `getByRole()` must not be used, as per the above.

Second, Chai does not have .toBeInDocument() but `.to.be.ok` (for a single returned object, i.e. to be truthy) or `.to.not.be.empty` (for an array) .

This is actually not very important once you understand what assertions do. The important part is in the getByRole (or correspondent, not throwing) testing-library function, not in the name of the assertion used.

# Testing Views
In general, when testing a certain value, trim() it before, in order for the extra space that may be in the student tree to be ignored, as it is not visible in the browser page anyway

``` 
<span >   { value } </span>        
```
Testing for   <span>3</span>   will fail!

Some View test code like "View X does not change its props" will probably not work with testing-library. That test may done by findCustomEvents.

Once the View tests work with testing-library as before, we may want to do an improvement.

Students have complained in the past that the tree-structure tests are too strict, and there is too much work to follow the given tree. Therefore I think the View tests should have two steps:
- test that the expected values (coming from props) are in the view, and in the correct order. This is already done by the details view test, which has no tree on the tutorial slide
- test the tree. We may disable this test in the future, if it generates a lot of nitty-gritty student work


# Testing Presenters
Presenters must be tested with both frameworks starting week 1. Students can choose to use React (with Mobx) from week 1. See Multi-framework tests above.

Once the Presenter tests work with testing-library as before, we may want to do an improvement. Currently there are 3 kinds of tests
- test with several non-reactive models (simple objects, maybe proxies), check if the View is instantiated with the correct props
- test with reactive model, check that the view is re-rendered (updated) with the correct props (check the mock props history)
- test if the presenter handles custom events and changes the model correctly

With testing-library we may want to add
- "end-to-end" test, reactive model, presenter with real (non-mocked) view, test that the view is updated when the model changes.


# Mocking `fetch()` with MWS
MWS replaces the usage of `fetch()` to interact with our mocked server rather than the actual network.

### How to use
```
import { server } from "./mocks/testServer.js";
```

In the test files, we specify the server to be activated before all tests and closed after all tests are completed. Additionally, we reset the handlers between each test in case we modify any handlers during our test runs. This can be accomplished within each test to adjust the mocked response.
```
describe("test blabla", function(){
   this.beforeAll(() => server.listen());
   this.afterAll(() => server.close());
   this.afterEach(() => server.resetHandlers());

   it("blabla" function(){
      // Perform a fetch
      // Alternatively, test presenters that automatically perform fetches
   });
});
```

Within mocks/handlers.js, we define the standard API calls that we intend to mock.
```
export const handlers = [
  rest.get('https://brfenergi.se/iprog/group/200/recipes/complexSearch', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Mocked data response for search'
      }),
    );
  }),
  // Add more handlers for other endpoints as needed
];
```
Specify the URL to be mocked, the desired status code, and the JSON response we wish to provide.

For testing error handling, we can modify the handler within our test to mock a response with a non-200 status code.
```
it("blabla" function(){
      server.use(
         rest.get('https://brfenergi.se/iprog/group/200/recipes/complexSearch', (req, res, ctx) => {
            return res(
               ctx.status(500)
            );
         });
      );
   });
```
