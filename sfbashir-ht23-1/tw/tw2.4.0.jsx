import {render} from "./teacherRender.js";
import getModule from "/test/filesToTest.js";
import {reactive} from "vue";

const X= TEST_PREFIX;

const resolvePromise=(await getModule(`/src/${X}resolvePromise.js`))?.default;

// promissify setTimeout
function sleep(ms){ return new Promise(function(resolve, reject){ setTimeout(resolve, ms); });}

if(!resolvePromise){
    render(<div>Please define /src/resolvePromise.js</div>, document.getElementById('root'));
}else{
    const preamble= <div><p> This is the TW2.4 resolvePromise test. Timing:</p>
                      <p>second 1: initiates a promise that takes 2000 miliseconds to resolve</p>
                      <p>second 5: initiates a promise that takes 1000 miliseconds to resolve</p>
                      <p>second 8: initiates a promise that takes 3000 miliseconds to resolve</p>
                      <p>second 10: initiates a promise that takes 500 miliseconds to resolve</p>
                      <p>Note that the last-but-one promise will overwrite the result of the last promise. This simulates a <b>race condition</b>.</p>
                      <p>If your resolvePromise does not check for a race condition, you will see 3000 at the end (after briefly seeing 500). If your resolvePromise does check for a race condition, you will see 500 at the end, and never see 3000.</p>
                      <p>You can edit tw/tw2.4.0.js to play with different time sequences.</p>
                      <hr/></div>;

    const promiseState= reactive({});
    
    // function that returns a callack!
    function makeCallback(ms){
        function returnDataACB(){
            return "resolved after "+ms;
        }
        function laterACB(){
            const promise= sleep(2000).then(returnDataACB);
            promise.name="promiseToResolveAfter_"+ms;
            resolvePromise(promise, promiseState);
        }
        return laterACB;
    }
    
    sleep(1000).then(makeCallback(2000));
    sleep(5000).then(makeCallback(1000));
    sleep(8000).then(makeCallback(3000));
    sleep(10000).then(makeCallback(500));
    const Root= {
        render(){  return <div>current promise state : {JSON.stringify(promiseState)}</div>; }
    };
    render(
        <div>{preamble} <Root/> </div>
        ,    document.getElementById('root')
    );
}



