import {render} from "./teacherRender.js";
import getModule from "/test/filesToTest.js";

const X= TEST_PREFIX;

const SearchFormView=(await getModule(`/src/views/${X}searchFormView.jsx`))?.default;

if(!SearchFormView){
    render(<div>Please define /src/views/searchFormView.jsx</div>,  document.getElementById('root'));
}
if(SearchFormView){
    const preamble= <div><p> This is the TW2.3 search form view test. Note that this is just a View and interatction will not work yet.</p>
			<p>The props 'text' and 'type' are set, to demonstrate the case when the search form was hidden away and the user comes back to it during Navigation (TW3). Then we want the user to see what they searched for last time.</p>
			<p>You can edit tw/tw2.3.jsx to write the names you chose for the 3 custom events, so you can test custom event firing</p>
                    <hr/></div>;
    render(<div>{preamble}
               <SearchFormView dishTypeOptions={["starter", "main course", "dessert"]}
			       text="pizza"
			       type="main course"
                               onTextChange={function searchTextACB(txt){ console.log("user wants to set the dish search text ", txt); }}
                               onTypeChange={function searchTypeCB(typ){ console.log("user wants to set the dish search type ", typ); }}
                               searchButton={function searchNowACB(){ console.log("user wants to search now!"); }}
        /></div>,
        document.getElementById('root')
    );
}
