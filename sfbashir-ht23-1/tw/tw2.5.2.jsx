import {render, renderMethod, reactiveMethod} from "./teacherRender.js";
import getModule from "/test/filesToTest.js";

const X= TEST_PREFIX;
const Y= renderMethod;

const model=(await getModule(`/src/${X}DinnerModel.js`))?.default;
const Search= (await getModule(`/src/${Y}js/${X}searchPresenter.jsx`))?.default;

if(!Search){
    render(<div>
             Please write /src/{Y}js/searchPresenter.jsx
           </div>,  document.getElementById('root'));
}
if(Search){
    const preamble=<div><p> This is the TW2.5 Vue Search presenter test.</p>
                     <p>It displays the Search interface, and you should be able to perform searches</p>
                     <p>When you are done with the presenter, you should also see some initial search results.</p>
                     <p>You can access and manipulate the model from the Console using myModel. Changing the model should be visible in the user interface.</p>
                     <hr/></div>;

    window.myModel= reactiveMethod(model);

    render(
        <div>{preamble}<Search model={window.myModel} /></div>
        ,    document.getElementById('root')
    );
}
