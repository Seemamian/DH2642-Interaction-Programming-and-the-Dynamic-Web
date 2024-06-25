import {render} from "./teacherRender.js";
import {reactive} from "vue";

import getModule from "/test/filesToTest.js";

const X= TEST_PREFIX;

const model1=(await getModule(`/src/${X}DinnerModel.js`))?.default;

//const AA= 523145,   BB= 787321,   CC= 452179;
//const AA= 548321,   BB= 758118,   CC=    1152690;
const AA= 1445969,  BB=  1529625, CC=    32104;

let proxyModel;
const preamble=<div><p> This is the TW2.4 setCurrentDish test</p>
                 <p>In the beginning it should show an empty currentDishPromiseState</p>
                 <p>After 2 seconds, the current dish is set and the promise state should get populated with data</p>
                 <p>After 6 seconds, the current dish is set again, so you can see the promise state changing</p>
                 <p>You can edit tw/tw2.4.js to see other dish data in the promise state</p>
                 <hr/></div>;

const rootModel= reactive(model1);

const Root={
    render(){
        return <div>
                 current dish promise state: {JSON.stringify(rootModel.currentDishPromiseState)}
               </div>;
    },
};

render(
    <div> {preamble} <Root/> </div>
    ,    document.getElementById('root')
);

setTimeout(function firstlyACB(){rootModel.setCurrentDish(BB);}, 2000);

setTimeout(function laterACB(){rootModel.setCurrentDish(AA);}, 6000);

