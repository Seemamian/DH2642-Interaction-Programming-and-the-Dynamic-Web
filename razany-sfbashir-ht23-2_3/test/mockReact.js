import installOwnCreateElement from "./jsxCreateElement";

/*
this module is not in use. It simulates React state management and effects. 
Can be interesting reading though
*/

function renderWithState(component, props){
    let hookNumber;
    let rendering;
    const stateValues=[];
    
    let effectNumber;
    let renderIndex=0;
    let renderAndState=[];

    let renderingNow=false;
    let inEffect=false;
    let renderError;
    
    function doRender(){
        while(!renderError){
            let change;
            // if state is not different from the previous, we bail out.
            if(renderIndex && renderAndState.length &&  !(change=diffArr(stateValues, renderAndState[renderAndState.length-1].initialState)).length){
                return;
            }
            //console.log("rendering ", renderIndex, " state ", [...stateValues]);
            installOwnCreateElement();
            window.React.useState=useState;
            window.React.useEffect=useEffect;
            hookNumber=0;
            effectNumber=0;
            renderingNow=true;
            const initialState=[...stateValues];
            try{
                renderAndState[renderIndex]={ rendering: component(props), initialState: initialState, state:[...stateValues], change};
                //console.log("rendering ", renderIndex, " done");
            }
            finally{renderingNow=false; renderIndex++; }
        };
    }
    
    function useState(initialValue){
        let index=hookNumber;
        function setter(value){
            if(stateValues[index]!==value){
                //   console.log("React mock state "+ index + " "+ stateValues[index] +"->"+value);
                const oldValue= stateValues[index];
                stateValues[index]=value;
                if(!renderingNow)
                    doRender();
                else
                    if(!inEffect){
                        throw renderError=new Error("changing React state during rendering");
                    }
            }
        }
        try{
            if(!renderIndex){
                if(typeof initialValue=="function")
                    // if initial value is a function, we call it to find the actual value
                    initialValue=initialValue();
                stateValues[index]=initialValue;
            }
            //if(index>=stateValues.length)
            //    throw renderError= new Error("extra React state added after first render: index "+index+ " value "+ initialValue);
            return [stateValues[index], setter];
        }finally{
            hookNumber++;
        }
    }
    const oldArr=[];
    const cleanups=[];
    function useEffect(cb, arr){
        try{
            if(!oldArr[effectNumber] || diffArr(oldArr[effectNumber], arr).length){
                if(cleanups[effectNumber])
                    cleanups[effectNumber]();
                inEffect=true;
                cleanups[effectNumber]= cb();
            }
        }finally{
            inEffect= false;
            oldArr[effectNumber]=arr;
            effectNumber++;
        }
    }

    try{
        doRender();
    }catch(e){
        if(e.toString().indexOf("Invalid hook call")!=-1)
            throw new Error("Do not import React at the labs! This allows us to better test your components.");
        throw e;
    }
    renderAndState.cleanup=function(){
        cleanups.forEach(function(clean){
            try{
                clean();
            }catch(e){
                console.error(e);
            }
        });
    };
    return renderAndState;
}

function diffArr(arr1, arr2){
    return arr1.reduce(function(acc, elem, i){
        return (elem!=arr2[i])?[...acc, {index:i, oldValue:arr2[i], newValue:elem}]:acc;
    }, []);
}

export {
    renderWithState
};
