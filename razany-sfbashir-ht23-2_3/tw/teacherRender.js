import "/src/teacherFetch.js";
import { observable, configure } from "mobx";
import { reactive } from "vue";

let render, renderMethod, reactiveMethod;

if(window.location.toString().includes("react")){
    window.React= await import("react");
    const createRoot = (await import("react-dom/client")).createRoot;
    render = function(x) { createRoot(document.getElementById('root')).render(x); };
    console.log("rendering "+window.location.pathname+" with React");
    renderMethod = 'react';
    configure({
        enforceActions: "never",
    });
    reactiveMethod = observable;
}else{
    const vue= await import("vue");
    render=vue.render;
    window.React={createElement: vue.h};
    console.log("rendering "+window.location.pathname+" with Vue");
    renderMethod = 'vue';
    reactiveMethod = reactive;
}

export {render, renderMethod, reactiveMethod};
