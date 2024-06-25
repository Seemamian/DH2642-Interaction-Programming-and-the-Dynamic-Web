After labs HT22
- all tests but TW1.1 DinnerModel are initially pending (#172)
- setNumberOfGuests not called any longer in DinnerModel constructor. This removes some constraints from Observer later
- DinnerModel setNumberOfGuests must throw Error. Mocha/chai does not like strings being thrown and may complain later on.
- currentDish is no longer a constructor parameter. Illustrate to students that not all DinnerModel properties need to be constructor parameters.
- SummaryView renderIngredients was removed (#174), as it is not usual practice
- TW2.2: complexSearch is the only accepted endpoint (#118) and the results view look for the right image URLs
- only one header is needed for the API. No other headers are accepted by tests
- checking for native event names is now in the same tests as checking the firing of custom events
- DetailsView: ingredient amount expect message was wrong, as it was talking about 2 decimal places but both 2 decimal places and any number of decimal places was accepted. We now only require the amount given by the spoonacular data.
- a central mock model infrastructure was implemented, using Proxy. Students can now use model properties that they are not supposed to use for a certain presenter, but they will get Warning: unexpected access to Model dishes. A default value will be returned (in: DetailsPresenter with no promise data). Attempting to use model methods others than the ones that the respective presenter is supposed to use will throw an Error.
- notifyObservers must do try/catch per observer, so if an observer fails, the others will still work
- Vue search presenter must do initial search in lifecycle (mounted())
- Vue compoistion API passes the tests
- React search presenter with effect briefly renders "no data". That's how we check that it uses an effect
- Vue lifecycle must use mounted() instead of created() (at least for Search presenter). This means that (like in React) "no data" is brifely rendered (not visible really) before the loading image appears
- Firebase model tests try to help the student a bit more by noticing that properties read from db are not the ones written, detecting "cannot read property of undefined" (data.val() undefined), "cannot convert null or undefined to object" (data.val().dishes undefined, which leads Object.keys() to throw)


Tools:
- unit test stacktraces are now printed on the Console
- possibility to add MD links \[text\]\(link\) in the suite names. Links are removed from Mocha-generated DOM and shown comma-separated, just after the suite name


TODO
- test at least X or link click for printing (?) the dish ID
- test the X and link buttons with multiple dishes (now it's only one)
- note each expect with course skill / concept

- compressHistory seems only to be needed for search
- for observer react, do we need rendering in DIV? We could grab the JSX and analyse it, for each state
- students don’t work with constructor and new Model(param1, param2) the whole course, and suddenly in 3.5 they have to call a constructor
- manual test for VueRoot and ReactRoot!

- add functionality one by one and see if the necessary tests passes/fails
- add links to every manual test
- comment each test so if students find prolems in it, they at understand what the test is aiming at
- ask students to deploy early?
- when you see Proxy, click on Target
- firebase lecture: anything can become undefined by *other* means than programming. E.g. manual removal. val() or val().dishes
- observers notified *after* model change
- <tag>{expr}</tag>, no spaces
- check that react useState(ACB) also renders "no data" briefly?
- link expects to course objectives/skills
- check JSON.stringify when dish arrays are printed
- proxy handler *setters* not working?
- check  with a proxy that the view property changes
- running some tests in isolation (e.g. 3.2 observers) does not work since observers are added in initialization code.

- multiple custom event discovery. Each custom event with its parameter (sidebar, search results)
- doSearch test was a bit naive. Maybe setCurrentDish is as well
- navigation-only buttons onClick currently not checked... but by that time React was chosen
- possibility to handle sidebar and search form custom events one by one during development
- remove doSearch ?
- use JSX rather than DOM rendering in TW1 and TW2?
- props (incl pass from presenter) and array rendering before events
- help students with extra spaces in HTML  https://gits-15.sys.kth.se/iprog/issues/issues/554
- separate test for SidebarView sorting?
- 1.1 manual test (just provide all utilities functions as globals, plus myModel)
- slide explaining how to find the stacktrace on console. Obligatory stacktrace in Issues
- protection against call callback (see "did not expect x to e called" in 2.5 search presenter tests)
- show why the TW2.5 search presenter is disabled

AssertionError: latest promise result should be set in promiseState.data: expected null to equal 'resolved after 10'
    at Context.tw2_4_05_4 (tw2.4-05-resolvePromise.test.js:75:39)

- lecture/lab: arrow down with callback prop, arrow up with callback prop invocation
- lecture slide about transforming promise result. Intuitive but doesn't work: getPokemonName(id){return getPokemon(id).name; }
- lecture segment explaining typical erros (cannot access property of undefined, undefined is not a function, x is not defined)
