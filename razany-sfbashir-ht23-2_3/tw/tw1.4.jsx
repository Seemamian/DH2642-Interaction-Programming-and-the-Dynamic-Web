import {render} from "./teacherRender.js";
import dishesConst from "/test/dishesConst.js";
import  {plusMinusEventName, removeEventName, currentDishEventName} from "../test/sidebarUtils.js";

import getModule from "/test/filesToTest.js";
import getType from "/test/componentType.js";

const X= TEST_PREFIX;

const SidebarView= !window.location.toString().includes("react") && (await getModule(`/src/views/${X}sidebarView.vue`))?.default ||
      (await getModule(`/src/views/${X}sidebarView.jsx`))?.default;

const winReact= window.React;
function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}

if(!SidebarView)
    render(<div>Please define /src/views/sidebarView.jsx</div>,  document.getElementById('root'));

let dishClickedCustomEvent;
try{
    dishClickedCustomEvent= currentDishEventName(true);  // true: don't check the parameters passed to the custom event
}catch(e){}

let xClickedCustomEvent;
try{
    xClickedCustomEvent= removeEventName(true);
}catch(e){}

window.React=winReact;

if(SidebarView){
    let props= {
        number:5,
        dishes:[getDishDetails(2), getDishDetails(100), getDishDetails(200)],
        onNumberChange:    function numberChangeACB(nr){ console.log("custom event 'onNumberChange' fired, argument:", nr);}     
    };
    if(dishClickedCustomEvent)
        props= {...props, [dishClickedCustomEvent]: function dishClickedACB(x){ console.log("custom event '", dishClickedCustomEvent,"' fired on dish link click, argument: ", x);} };
    if(xClickedCustomEvent)
        props= {...props, [xClickedCustomEvent]: function xClickedACB(x){ console.log("custom event '", xClickedCustomEvent,"' fired on dish x button, argument: ", x);} };
    render(
        <div>
          <div> <p>TW1.4 events: here you can test the <b>(native) click events</b> detected by SidebarView, as well as the custom events it fires.</p>
        <p>For starters, just write click event listeners that log some text, and watch the Console. Log the desired number (the number prop + 1 for the + button ,the number prop -1 for the - button), and for the x and link clicks, log e.g. the dish object.</p>
          </div>
          <hr/>
          <SidebarView {...props}   />
          <hr/>
          <p>The aim of this tutorial step is to <b>fire custom events</b> for each of these native events. For the number, the custom event name must be <code>onNumberChange</code>. Look at the Console to see how the test handles the custom event!</p>
          <p>For clicking on an x button, as well as for clicking on a dish link, you can choose the two (different) custom event names. We detect these custom event names automatically if they are fired.  Look at the Console to see how the test handles these custom events! Note that you should see the dish parameter logged on the Console when you fire the event by clicking in the UI!</p>
            <p>The custom event we have detected for clicking on dish links is: <code>{dishClickedCustomEvent || "none yet"}</code></p>
            <p>The custom event we have detected for clicking on an x button is: <code>{xClickedCustomEvent || "none yet"}</code></p>
        </div>,
        document.getElementById('root')
    );
}

    
