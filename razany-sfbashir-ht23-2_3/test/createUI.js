export default function createUI(){
//    if(typeof window != 'undefined')   // we are in a browser
        return document.createElement("div");

//    const REQ= '';
//    const{ JSDOM} =require(REQ+'jsdom');   // we are in node, this part is untested:
//    return new JSDOM("<div></div>").window.document.body.firstElementChild;
}
