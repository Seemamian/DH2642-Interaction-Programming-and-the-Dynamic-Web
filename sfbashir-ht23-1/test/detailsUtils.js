import { assert, expect } from "chai";
import {findTag, prepareViewWithCustomEvents} from "./jsxUtilities.js";
import {dishInformation} from "./mockFetch.js";

import {dummyImgName} from "./searchUtils.js";
import makeModelProxyHandler from "./mockModel.js";
import * as payloadUtils from "./payloadUtils.js";

import {withMyFetch, myDetailsFetch} from "./mockFetch.js";
import getModule from "./filesToTest.js";
import cloneModel from "./cloneModel.js";

const X = TEST_PREFIX;

const DetailsView= (await getModule(`/src/views/${X}detailsView.jsx`))?.default;
const modelTemplate=  cloneModel((await getModule(`/src/${X}DinnerModel.js`))?.default);


function findDetailsEventName(){
    const {customEventNames}= prepareViewWithCustomEvents(
        DetailsView,
        {dishData:dishInformation, isDishInMenu:true, guests:6},
        function findButton(rendering){
            const button=findTag("button", rendering).filter(function(button){ return button.props && button.props.disabled; });
            expect(button.length, "expected to find a disabled 'add to menu' button in Details view").to.equal(1);
            return button ;
        });
    return customEventNames;
}

let turnOff;

async function makeRender(DetailsPresenter, React, render, h, model, propsHistory){
    let vueModel={};
    const Root={
        name:"Root",
        props: ["model"],
        data(){ return {rootModel:this.model};},
        render(){
            return h(DetailsPresenter,{ model:vueModel.model=this.rootModel});
        },
    };
    
    function Dummy(props){
        propsHistory.push(props);
        return h("span", {}, "dummy view");
    }
    function DummyImg(props){
        propsHistory.push(dummyImgName);
        return "dummyIMG";
    }
    function DummyNoData(props){
        propsHistory.push("no promise, no data");
        return "no data";
    }  

    function replaceViews(tag, props, ...children){
        if(tag==DetailsView)
            return h(Dummy, props);
        if(tag=="img") // FIXME this assumes that the presenter renders no other image than the spinner
            return h(DummyImg, props);
        if(tag=="div" && children && children[0] && (""+children[0]).toLowerCase()=="no data") {
            return h(DummyNoData, props);
        }
        return h(tag, props, ...children);
    };
    function Guard(props){
        const [state, setState]= React.useState(true);
        React.useEffect(()=> turnOff=()=>setState(false), []);
        return state && props.children;
    }
    const div= document.createElement("div");
    window.React=React;
    React.createElement= replaceViews;
    propsHistory.length=0;
    await withMyFetch(
        myDetailsFetch,
        ()=>render(React.useState?
                   h(Guard, {},h(DetailsPresenter, {model})):
                   h(Root,{model}), div)
        );
    return {div, vueModel};
}

function doTests(DetailsPresenter, React, render, h){
    const propsHistory=[];

    let addedDish;
    
    let observers=[];
    let modelTarget;
    let added=0;
    let removed=0;


    
    const model= new Proxy(modelTarget={
        dishes: [],
        numberOfGuests: 7,
        currentDish:null,
//        currentDishPromiseState:{ },
        d(x){ this.dishes=x; },
        cd(x){ this.currentDish=x;},
        ng(x){ this.numberOfGuests=x;},
        addObserver(o){ added++; observers.push(o);},
        removeObserver(o){ removed++; observers.length=0; },
        addToMenu(dish){ addedDish=dish; },
    }, makeModelProxyHandler("React Details presenter"));

    function doRender(){ return makeRender(DetailsPresenter, React, render, h, model, propsHistory);}
                         
    function checkAgainstModel(isInMenu){
        expect(propsHistory.slice(-1)[0].guests, "passed people should be the number of guests").to.equal(model.numberOfGuests);
        expect(propsHistory.slice(-1)[0].dishData?.id, "passed dish should be the data in the current dish promise state").to.equal(42);
        if(isInMenu)
            expect(propsHistory.slice(-1)[0].isDishInMenu, "isDishInMenu should be truthy if the displayed dish is in the menu").to.be.ok;
        else
            expect(propsHistory.slice(-1)[0].isDishInMenu, "isDishInMenu should be falsy if the displayed dish is not in the menu").to.not.be.ok;

        if(React.useState){
            if(!added)
                expect.fail("no observer was added");
            expect(added, "repeated observer additions, do you miss the second useEffect parameter? That makes the effect execute at each render").to.equal(1);
            expect(removed, "repeated observer removals, did you miss the second useEffect parameter?").to.equal(0);
        }
    }

    it("Details presenter 'no data' when current dish is not set",  async function tw_3_2_50_2(){
        added=0;
        removed=0;
        observers=[];
        modelTarget.currentDish=null;
        await doRender();

        expect(propsHistory.slice(-1)[0], "'no data' should be rendered when there is no current dish").to.equal("no promise, no data");
        // at this point renderDiv.innerText is "no data" due to the DummyNoData above
    });

    it("DetailsPresenter resolves a promise when the current dish is set", async function tw_3_2_50_2_1(){
        added=0;
        removed=0;
        observers=[];
        modelTarget.currentDish=null;
        await doRender();
        const {changeGuests, addDish, removeDish, noCurrentDishPromise, changeCurrentDish, dummyNotification}=payloadUtils;
        await withMyFetch(
            myDetailsFetch, 
            async ()=>await changeCurrentDish(modelTarget, observers, propsHistory, true)
        );
//        await new Promise(resolve => setTimeout(resolve));
        expect(propsHistory.slice(-2)[0], "an image should be rendered when there is no data").to.equal(dummyImgName);
        checkAgainstModel();
     

    });

    it("DetailsPresenter updates when other relevent model data changes", async function tw_3_2_50_2_2(){
        added=0;
        removed=0;
        observers=[];
        modelTarget.currentDish=42;
        await doRender();
        const {changeGuests, addDish, removeDish, noCurrentDishPromise, changeCurrentDish, dummyNotification}=payloadUtils;

        modelTarget.dishes=[];
        
        await changeGuests(modelTarget, observers, propsHistory, true);
        checkAgainstModel();
        await addDish(modelTarget, observers, propsHistory, true);
        checkAgainstModel(true);

        await removeDish(modelTarget, observers, propsHistory, true);
        checkAgainstModel();
        
        //await noCurrentDishPromise(modelTarget, observers, propsHistory, true);
     

    });

    
    it("Details presenter handles custom event by adding to menu", async function tw_3_2_50_1(){
        observers=[];
        modelTarget.currentDish=42;
        added=0;
        removed=0;
        const[add2Menu]=findDetailsEventName();
        //modelTarget.currentDishPromiseState={ promise: Promise.resolve("dish info"), data:dishInformation };
        
        await doRender();
        
        expect(propsHistory.length, "DetailsView should be rendered when there is a current dish").to.be.ok;
        checkAgainstModel();
        expect(propsHistory.slice(-1)[0][add2Menu], "custom event hanlder "+add2Menu+" must be a function").to.be.a("Function");

        propsHistory.slice(-1)[0][add2Menu]();
        expect(addedDish?.id, "custom event handler should call the appropriate model method").to.equal(42);
    });

    it("Details presenter does not update view on dummy observer notification",  async function tw_3_2_50_2_5(){
        observers=[];
        modelTarget.currentDish=42;
        await doRender();
        propsHistory.length=0;
        const {changeGuests, addDish, removeDish, noCurrentDish, changeCurrentDish, dummyNotification}=payloadUtils;
        await dummyNotification(modelTarget, observers, propsHistory);
    });

    if(React.useState)
    it("Details presenter removes observer subscriptions at teardown", async  function tw_3_2_50_3(){
        added=0;
        removed=0;
        observers=[];
        modelTarget.currentDish=null;
        await doRender();
        const {changeGuests, addDish, removeDish, noCurrentDishPromise, changeCurrentDish, dummyNotification}=payloadUtils;
        
        await withMyFetch(
            myDetailsFetch, 
            async ()=>await changeCurrentDish(modelTarget, observers, propsHistory, true)
        );
        turnOff();
        await new Promise(resolve => setTimeout(resolve));

        if(!added)
            expect.fail("no observer was added");
        expect(added, "repeated observer additions, do you miss the second useEffect parameter? That makes the effect execute at each render").to.equal(1);
        if(!removed)
            expect.fail("observer was not removed at teardown");
        
        expect(observers.length, "observers should be unsubscribed at teardown").to.equal(0);
        
    });
    checkModelFetch();
}

function checkModelFetch(){
    it("DinnerModel setCurrentDish does not initiate a fetch", function tw_3_2_70_5(){
        try{
            modelTemplate.setCurrentDish(314);
        }catch(e){
            if(e.message.indexOf("made a fetch that is not expected by the tests")!=-1)
                expect.fail("The model initiated a fetch in setCurrentDish:\n"+e);
            throw e;
        }
    });

}
export {findDetailsEventName, doTests, makeRender, checkModelFetch};
