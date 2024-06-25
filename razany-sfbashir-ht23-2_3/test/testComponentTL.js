import * as vueTL from "./vtl/index.js";
import {h} from "vue/dist/vue.esm-bundler.js"; 

import {createElement} from "react";
import * as reactTL from "@testing-library/react";

import mockComponent from "./mockComponent.js";
import {observable} from "mobx";
import {reactive} from "vue";


const renderers= {
    vue:{
        createElement:h,
        TL: vueTL,
        displayName: "Vue",
        renderWithProps(component, props, container){
            return vueTL.render({
                components: { Component: component},
                template: "<Component/>"
            },{
                props,
                container
            });
        },
        linkSuffix: "",
    },
    react:{
        createElement,
        TL: reactTL,
        displayName: "React",
        renderWithProps(component, props, container){
            return reactTL.render(createElement(component, props), { container});
        },
        linkSuffix: "-react",
    }
};

const obsrvbl=  { vue: reactive, react: observable };


function prepareTest(components, framework, props, test){
    if(!components[framework])
        test.skip();
    if(Object.keys(props).length===1 && props.model){
	props.model= obsrvbl[framework]( props.model);
    }	
    window.React={createElement: renderers[framework].createElement};
    const mockHandlers= components.mock?.map(function mockEach(mock){
        return mockComponent(mock.component, mock.dummyText);
    }); 
    const myDiv=  document.createElement("div");
    const output= renderers[framework].renderWithProps(components[framework], props, myDiv);
    output.reactiveModel= props.model;
    output.theDiv= myDiv;
    output.fireEvent= renderers[framework].TL.fireEvent;
    output.mockHandlers= mockHandlers;
    return output;
}

function getTestName(testCase, framework){
    return testCase.replace("$framework", renderers[framework].displayName).replace("$linkSuffix", renderers[framework].linkSuffix);
}

export default function testComponentTL(components, manyProps, ...testCases){
    if(!(manyProps instanceof Array))
        manyProps=[manyProps];

    ["vue", "react"].forEach(function renderWith(framework){
        if(components.hasOwnProperty(framework))
            for(let i=0; i<testCases.length; i+=2){
                it(getTestName(testCases[i], framework), function testComponentWithFramework(){
                    for(let index=0; index<manyProps.length; index++){
                        const output= prepareTest(components, framework,  manyProps[index], this);
                        testCases[i+1](output, index, output.mockHandlers, this);
                   };
                });
            }
    });
    
}

function asyncTestComponent(components, manyProps, ...testCases){
    if(!(manyProps instanceof Array))
        manyProps=[manyProps];

    ["vue", "react"].forEach(function renderWith(framework){
        if(components.hasOwnProperty(framework))
            for(let i=0; i<testCases.length; i+=2){
                // TODO: sometimes the test function will be async
                it(getTestName(testCases[i], framework), async function testComponentWithFramework(){
                    for(let index=0; index<manyProps.length; index++){
                        const output= prepareTest(components, framework,  manyProps[index], this);
                        await testCases[i+1](output, index, output.mockHandlers, this);
                   };
                });
            }
    });
    
}

export {asyncTestComponent};
