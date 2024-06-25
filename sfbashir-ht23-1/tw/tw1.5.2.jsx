import dishesConst from "/test/dishesConst.js";
import {render, renderMethod, reactiveMethod} from "./teacherRender.js";

import getModule from "/test/filesToTest.js";

const X= TEST_PREFIX;
const Y= renderMethod;
const model=(await getModule(`/src/${X}DinnerModel.js`))?.default ;

const Sidebar=(await getModule(`/src/${Y}js/${X}sidebarPresenter.jsx`))?.default ;
const Summary=(await getModule(`/src/${Y}js/${X}summaryPresenter.jsx`))?.default ;

const proxyModel= reactiveMethod(model);

render(<div>
         This is the final TW1 test, it displays the full App. Do not forget to add the Sidebar presenter in src/views/app.js, for it to be visible here.
         <p> To make this fully interactive, you need to <b>handle custom events</b> in the Sidebar Presenter:</p>
         <ul>
             <li><code>onNumberChange</code> should invoke the Model method that changes the number of guets</li>
             <li>the two dish-related custom events fired by SidebarView: one should set the current dish on the Model, the other should remove a dish from the Model</li>
           </ul>
         <hr/>
         <Sidebar model={proxyModel}/>
         <Summary model={proxyModel}/>
         <hr/>
         Interact with your app! When the Model is changed by the custom event handlers, this test uses a Vue "reactive object" to update the app. 
         <p>The Model is exported into the <code>myModel</code> global, so you can change the Model from the Console and see the changes in the UI. Test this at the Console: <code>myModel.setNumberOfGuests(2)
</code></p>
       </div>,
    document.getElementById('root')
);

window.location.hash="#summary";
window.myModel= proxyModel;
function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}


window.myModel.addToMenu(getDishDetails(200));
window.myModel.addToMenu(getDishDetails(2));
window.myModel.addToMenu(getDishDetails(100));
window.myModel.addToMenu(getDishDetails(1));
window.myModel.setNumberOfGuests(5);
