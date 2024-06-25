import dishesConst from "/test/dishesConst.js";
import {render, renderMethod, reactiveMethod} from "./teacherRender.js";

import getModule from "/test/filesToTest.js";
import getType from "/test/componentType.js";

const X= TEST_PREFIX;
const Y= renderMethod;

const model=(await getModule(`/src/${X}DinnerModel.js`))?.default ;
const Sidebar=(await getModule(`/src/${Y}js/${X}sidebarPresenter.jsx`))?.default ;
const Summary=(await getModule(`/src/${Y}js/${X}summaryPresenter.jsx`))?.default ;

const proxyModel= reactiveMethod(model);

let getMenuDetails= (await getModule(`/src/${X}dishSource.js`))?.getMenuDetails;

if(!getMenuDetails)
    render(<div>Please write /src/dishSource.js and export getMenuDetails</div>,  document.getElementById('root'));

if(getMenuDetails){
    window.getMenuhDetails=getMenuDetails;
    //const AA= 523145,   BB= 787321,   CC= 452179;
    const AA= 548321,   BB= 758118,   CC=    1152690;
    //const AA= 1445969,  BB=  1529625, CC=    32104;

    const preamble= <div><p> This is the TW2.2 getMenuDetails test. It reads 3 dishes and, when they arrive, it saves them into the model</p>
                      <p>Check (and change in tw/tw2.2.0.js) the source code for other interesting dish IDs</p>
                      <p>getMenuDetails is set as global by this test, so you can experiment with it at the Console.</p>
                      <p>You can use the myModel object to examine the model at the Console.</p>
                      <hr/></div>;
    render(
        <div>{preamble}Wait...</div>,
        document.getElementById('root')
    );
    getMenuDetails([AA, BB, CC]).then(
        function testACB(dishes){
            render(
                <div>{preamble}
                  <Sidebar model={proxyModel}/>
                  <Summary model={proxyModel}/>
                </div>,
                document.getElementById('root')
            );
            window.myModel= proxyModel;
            
            dishes.forEach(function addDishCB(dish){window.myModel.addToMenu(dish);});
            window.myModel.setNumberOfGuests(5);
        })
        .catch(function errorACB(err){
            console.error(err);
            render(<div>{err}</div>,document.getElementById('root'));
        });
}
