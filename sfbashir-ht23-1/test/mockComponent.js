export default function mockComponent(component, dummyText){
    const h= window.React.createElement;
    const propsHistory=[];
    window.React.createElement=function(a, b, ...c){
        if(a=== component){
            propsHistory.push(b);
            return h("pre", null, dummyText+" "+propsHistory.length);
        }
        return h(a, b, ...c);
    };
    return {
        propsHistory,
        close(){ window.React.createElement= h; }
    };
        
}
