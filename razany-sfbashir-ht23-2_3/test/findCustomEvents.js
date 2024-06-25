import {findTag, prepareViewWithCustomEvents} from "./jsxUtilities.js";

export default function findCustomEvents(view, props){
   
    return {
        button: process(prepareViewWithCustomEvents(
            view, props,
            function collectControls(rendering){ return findTag("button", rendering); //.filter(t=>t.props?.onClick || t.props?.onclick);
                                               }, undefined, true)),
                        
        span: process(prepareViewWithCustomEvents(
            view, props,
            function collectControls(rendering){ return findTag("span", rendering);
                                                 // .filter(t=>t.props?.onClick || t.props?.onclick);
                                               }, undefined, true)),
        a: process( prepareViewWithCustomEvents(
            view, props,
            function collectControls(rendering){ return findTag("a", rendering);
                                               //  .filter(t=>t.props?.onClick || t.props?.onclick);
                                               }, undefined, true)),
        input: process(prepareViewWithCustomEvents(
            view, props,
            function collectControls(rendering){ return findTag("input", rendering);
                                                 //.filter(t=>t.props?.onInput || t.props?.onChange|| t.props?.oninput|| t.props?.onchange);
                                               }, undefined, true)),
        select:  process(prepareViewWithCustomEvents(
            view, props,
            function collectControls(rendering){ return findTag("select", rendering);
                                                 //.filter(t=>t.props && (t.props?.onInput || t.props?.onChange|| t.props?.oninput|| t.props?.onchang));
                                               }, undefined, true)),
    };
}

function process(obj){
    return obj.clickables.map(function(clickable, index){
        return {
            element: clickable,
            customEventName: obj.customEventNames[index],
            customEventParams: obj.customEventParams[index],
	    nativeEventName: obj.nativeEventNames[index],
	    //tagDebug: obj.tagDebugs[index]
        };
    });
    
}
