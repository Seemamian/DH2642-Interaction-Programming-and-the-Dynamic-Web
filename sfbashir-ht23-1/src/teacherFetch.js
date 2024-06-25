const normalFetch= window.fetch;

const lastFetch=[{time:Date.now()}];

const message= `fetch() will stop working now, because the last 10 fetches were made in less than 15 miliseconds.
The code is still in an infinite re-render/infinite loop, and that will heat up your CPU.
To stop that, open Developer Tools and Reload ASAP. Then the code will pause. Check the Call Stack!
Look for useEffect() with no second parameter, or for state changes during render, since that triggers re-render.
`;

window.fetch=function(url, params){
    lastFetch.push({url, time:Date.now()});
    if(lastFetch.length>20 && lastFetch.slice(-1)[0].time - lastFetch.slice(-20)[0].time < 30){
        const fetches= lastFetch.slice(-20).map(x=>x.url+"\n").join("");
        
        console.warn("Execution will now pause because the last 20 fetches were made in less than 30 miliseconds. URLs below. \n"+
                     "Check the **Call Stack** to see where the offending call comes from!\n "+ fetches);
        debugger;
        document.body.innerText= message+fetches;
        throw new Error(message+fetches);
    }
    return normalFetch(url, params);
};
console.log("DH2642 fetch() infinite re-render protection installed");
