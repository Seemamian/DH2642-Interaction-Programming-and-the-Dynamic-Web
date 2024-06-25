import { expect } from "chai";
import installOwnCreateElement from "./jsxCreateElement";

function fireEvent(tag, value){
    if(tag.props?.onChange || tag.props?.onInput){
        /*
          const evt= new Event(tag.props.onChange?"change": "input",  {bubbles:true, cancellable:true});
          const input= document.createElement("input");
          input.value= "dummy";
          let transformedEvent;
          input.addEventListener(evt.type, function evtACB(e){ transformedEvent=e; });
          input.dispatchEvent(evt);
          // Problem: transformedEvent is now async. Therefore the solution below...
          */
        (tag.props.onChange || tag.props.onInput)({
            type: tag.props.onChange?"change":"input",
            bubles:true,
            cancellable:true,
            target:{value:value || "dummy "+(tag.tag=="input"?"text":"choice")}
        });
    }
    else if(tag.props?.onClick)
            tag.props.onClick(new Event("click",  {bubbles:true, cancellable:true}));
}

// transform an event object to something more readable
function transformEventCB(p){
    return (p?.type=="change" || p?.type=="input" || p?.constructor.name.indexOf("Event")!=-1)?
        ("Event{type:"+p.type+"}"):p;
}

function printTag(tag){
    if(!tag) return "";
    if(tag.constructor.name=="String")
        return tag;
    if(tag.constructor.name=="Array")
        return tag.map(printTag).join("");
    if(tag.constructor.name=="Function")
        return tag;
    return "<"+tag.tag+
        ((tag.props ||"") && Object.keys(tag.props).map(prop=>" "+prop+"="+(
            JSON.stringify(tag.props[prop]) || /* JSON.stringify(function) is undefined */tag.props[prop] 
        )).join(""))+
        ((!tag.children?.length)?"/>":">"+tag.children.map(printTag).join("")+"</"+tag.tag+">");
}

function checkNativeEvents(tag) {
    if(!tag?.props)
        return null;
    if(tag.tag=="input" || tag.tag=="select"){
        if(!Object.keys(tag.props).includes("onChange") && !Object.keys(tag.props).includes("onInput")){
            if(Object.keys(tag.props).includes("onchange"))
                expect.fail("onchange not accepted in the lab because it does not work with React. Please use onChange. In "+printTag(tag));
            if(Object.keys(tag.props).includes("oninput"))
                expect.fail("oninput not accepted in the lab because it does not work with React. Please use onInput. In "+printTag(tag));
	    return null;
        }
        if(Object.keys(tag.props).includes("onChange")){
            expect(tag.props.onChange, "expected onChange handler to be a function in tag "+printTag(tag)).to.be.a("function");
	    return "onChange";
	}
        if(Object.keys(tag.props).includes("onInput")){
            expect(tag.props.onInput, "expected onInput handler to be a function in tag "+printTag(tag)).to.be.a("function");
	    return "onInput";
	}
    }
    if(!Object.keys(tag.props).includes("onClick")){
        if(Object.keys(tag.props).includes("onclick"))
            expect.fail("onclick not accepted in the lab because it does not work with React. Please use onClick. In "+printTag(tag));
	// we defer this check to the client of findCustomEvents:
	//expect.fail("tag expected to define onClick native event listener. In "+printTag(tag));
    }
    if(tag.props.onClick){
	expect(tag.props.onClick, "expected onClick handler to be a function in tag "+printTag(tag)).to.be.a("function");
	return "onClick";
    }
    return null;
}


function prepareViewWithCustomEvents(view, props, makeButtons, eventValues, mayNotFire){
    let customEventName;
    let customEventParams;
    let currentTag;
    
    const propsProxy= new Proxy(props, {
        get(target, prop, receiver){
            if(!target[prop]){
                return function(...params) {
                    if(customEventName)
                        expect.fail("trying to discover custom event fired by tag gives ambigous results\n"+
                                    "both "+customEventName+" and "+prop+" . Are you using an unknown prop? \n"+
                                    printTag(currentTag));
                    customEventName= prop;
                    customEventParams= params;
                };
            }
            return target[prop];
        }
    });
    
    const h= installOwnCreateElement();
    try{
    const rendering= view(propsProxy);
    const clickables= makeButtons(rendering);
    let customEventsAndParams;
    try{
        customEventsAndParams=clickables.map(function fireEventOnTagCB(tag, index){
            const nativeEventName= checkNativeEvents(tag);
            customEventName= null;
            customEventParams=null;
            currentTag= tag;
            fireEvent(tag, eventValues && eventValues[index]);
            if(!customEventName){
                if(mayNotFire)
                    return [null, null, nativeEventName, printTag(tag)];
                else
                    expect.fail("Expected tag to fire a custom event: "+ printTag(tag) );
            }
            return [customEventName, customEventParams.map(transformEventCB), nativeEventName, printTag(tag)];
        });
    }catch(e){
        e.message= view.name +": " + e.message;
        throw e;
    }
    const propNames= customEventsAndParams.map(([a,b])=>a);
    const extraProps= propNames.reduce(function(acc, prop, index){
        return {...acc, [prop]:function(){}};
    }, {});
    const rendering1= view({...props, ...extraProps});
    return { rendering: rendering1,
             clickables: makeButtons(rendering1),
             customEventNames:propNames,
             customEventParams:customEventsAndParams.map(([a,b])=>b),
	     nativeEventNames:customEventsAndParams.map(([a,b,c])=>c),
	  //   tagDebugs: customEventsAndParams.map(([a,b,c, d])=>d),
	   };
    }finally{
        window.React={createElement:h};
    }

}

function findTag(tag, tree){
    if(!tree)
        return [];
    let tags= tree.children?
        tree.children.flat().map(
            function child2TagsCB(t){
                return findTag(tag, t);}
        ).flat()
    :[];
    if(tree.tag==tag)
        tags=[tree, ...tags];
    return tags;
}

function allChildren(tree){
    return !tree?[]:
        [
            tree, ...
                (tree.children?
                 tree.children.flat().map(function child2TagsCB(t){ return allChildren(t); }).flat()
                 :[])
        ];
}

// Returns true if there is a node in nodes whose property property
// which contain a query from queries.
function searchProperty(nodes, property, queries, tag=null, strictEqual = false) {
    function getVal(node){ return property=="textContent"?node.toString():node.tag==tag?node.props[property]:null; }
    
    if (!strictEqual)
        return nodes.some(
            function checkNodeCB(node){
                const val= getVal(node);
                return val &&
                    queries.some(function checkQueryCB(query){
                        return  val
                            .toLowerCase().includes(query.toString().toLowerCase());
                    });
            });
    else
        return nodes.some(
            function tw2_3_30_checkNodeCB2(node){
                const val= getVal(node); 
                return val &&
                    queries.some(function checkQueryCB2(query){return val === query.toString();});
            });
}

export {findTag, printTag, allChildren, searchProperty, prepareViewWithCustomEvents};

    
