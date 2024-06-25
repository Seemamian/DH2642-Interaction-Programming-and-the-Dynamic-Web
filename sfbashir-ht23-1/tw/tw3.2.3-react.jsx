import {render} from "./teacherRender.js";

import getModule from "/test/filesToTest.js";

const X= TEST_PREFIX;

const model1=(await getModule(`/src/${X}DinnerModel.js`))?.default;
const Details= (await getModule(`/src/reactjs/${X}detailsPresenter.jsx`))?.default;

if(!Details){
    render(<div>
             Please write /src/reactjs/detailsPresenter.jsx
           </div>,  document.getElementById('root'));
}
if(Details){
    const preamble=<div><p> This is the TW3.2 React Details presenter test (component state, lifecycle, observer, side effect)</p>
                     <p>The test is similar to the <a href="/tw2.5.1.html">Vue 2.5.1</a></p>
                     <p>It displays the Details with a model containing no current dish initially, so you should see "no data"</p>
                     <p>After 2 seconds the current dish is set and you should see it nicely rendered with your DetailsView</p>
                     <p>After 5 seconds the current dish is set again!</p>
                     <p>Edit tw/tw3.2.3.js to see other dishes</p>
                     <p>You can access and manipulate the model from the Console using myModel. Changing the model (e.g. setNumberOfGuests, setCurrentDish) should be visible in the user interface.</p>
                 <hr/></div>;    
    //const AA= 523145,   BB= 787321,   CC= 452179;
    //const AA= 548321,   BB= 758118,   CC=    1152690;
    const AA= 1445969,  BB=  1529625, CC=    32104;
    window.myModel=model;
    
    render(
        <div>{preamble}<Details model={window.myModel} /></div>
        ,    document.getElementById('root')
    );
    
    setTimeout(function laterACB(){window.myModel.setCurrentDish(AA);}, 2000);
    setTimeout(function laterACB(){window.myModel.setCurrentDish(CC);}, 5000);
}
