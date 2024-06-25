import {render} from "./teacherRender.js";
import dishesConst from "/test/dishesConst.js";

import getModule from "/test/filesToTest.js";
import getType from "/test/componentType.js";

const X= TEST_PREFIX;

const SummaryView= !window.location.toString().includes("react") && (await getModule(`/src/views/${X}summaryView.vue`))?.default ||
      (await getModule(`/src/views/${X}summaryView.jsx`))?.default;

const shoppingList= (await getModule(`/src/${X}utilities.js`))?.shoppingList;

function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}

render(
    <div>This page tests TW1.2 Basic Rendering in a SummaryView {getType(SummaryView)} for 3 people. We also use this page later to test TW1.3 Array Rendering, as it passes the ingredients prop.
      <hr/>
      <SummaryView people={3} ingredients={shoppingList([getDishDetails(2), getDishDetails(100), getDishDetails(200)])}/>
    </div>,
        
    document.getElementById('root')
);


    
