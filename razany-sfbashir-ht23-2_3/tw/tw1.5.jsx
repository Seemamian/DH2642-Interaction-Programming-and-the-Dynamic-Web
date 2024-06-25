import {render, renderMethod} from "./teacherRender.js";
import dishesConst from "/test/dishesConst.js";
import getModule from "/test/filesToTest.js";

const X= TEST_PREFIX;

const model=(await getModule(`/src/${X}DinnerModel.js`))?.default ;
function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}

model.addToMenu(getDishDetails(200));
model.addToMenu(getDishDetails(2));
model.addToMenu(getDishDetails(100));
model.addToMenu(getDishDetails(1));
model.setNumberOfGuests(5);

const Y= renderMethod;
const Summary=(await getModule(`/src/${Y}js/${X}summaryPresenter.jsx`))?.default;

if(!Summary)
    render(<div>Please define /src/{Y}js/summaryPresenter.jsx</div>,  document.getElementById('root'));

if(Summary) {   
    render(<div>TW1.5 Passing props from Presenters to Views. This is a test of the Summary presenter. It should show the summary view based on a model with 5 guests and 4 dishes.
             <p>The shopping list needed for the summary view must be computed in the presenter and passed to the View as the shoppingList prop.</p>
             <hr/>
             <Summary model={model}/>
           </div>
           ,
        document.getElementById('root')
    );
}    
