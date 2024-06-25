import {render, renderMethod} from "./teacherRender.js";
import dishesConst from "/test/dishesConst.js";
import getModule from "/test/filesToTest.js";

const X= TEST_PREFIX;
const Y= renderMethod;
const model=(await getModule(`/src/${X}DinnerModel.js`))?.default ;

function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}

model.addToMenu(getDishDetails(200));
model.addToMenu(getDishDetails(2));
model.addToMenu(getDishDetails(100));
model.addToMenu(getDishDetails(1));
model.setNumberOfGuests(5);

const Sidebar=(await getModule(`/src/${Y}js/${X}sidebarPresenter.jsx`))?.default ;

if(!Sidebar)
    render(<div>Please define /src/{Y}js/sidebarPresenter.jsx</div>,  document.getElementById('root'));

if(Sidebar) {   
    render(<div>TW1.5 Passing props from Presenters to Views. This is a non-interactive test of the Sidebar presenter. It should show the sidebar view based on a model with 5 guests and 4 dishes.
             <hr/>
             <Sidebar model={model}/>
           </div>
           ,
        document.getElementById('root')
    );
}    
