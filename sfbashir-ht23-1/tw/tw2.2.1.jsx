import {render} from "./teacherRender.js";
import getModule from "/test/filesToTest.js";

const X= TEST_PREFIX;

let searchDishes= (await getModule(`/src/${X}dishSource.js`))?.searchDishes;

if(!searchDishes)
    render(<div>Please write /src/dishSource.js and export searchDishes</div>,  document.getElementById('root'));

if(searchDishes){
    window.searchDishes= searchDishes;
    const preamble= <div><p> This is the TW2.2 searchDishes test. It performs a search for pizza as main course.</p>
                      <p>You can change tw/tw2.2.1.jsx to perform other searches</p>
                      <p>searchDishes is set as global by this test, so you can experiment with it at the Console.</p>
                      <hr/></div>;

    render(
        <div>{preamble}Wait...</div>,
        document.getElementById('root')
    );
    searchDishes({query:"pizza", type:"main course"}).then(
        function testACB(results){
            render(<div>{preamble}
                <ol>{
                    results.map(function eachResultCB(dishResult){
                        return <li key={dishResult.id}>{JSON.stringify(dishResult)}</li>;
                    })
                }</ol></div>,
                document.getElementById('root')
            );
        }).catch(function errorACB(err){
            render(<div>{err}</div>,document.getElementById('root'));
        });

}
