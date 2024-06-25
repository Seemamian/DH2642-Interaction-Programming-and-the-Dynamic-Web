// un-comment when needed:
import {sortIngredients} from "/src/utilities.js";
import "/src/style.css"

/* Functional JSX component. Name must start with capital letter */
function SummaryView(props){
    return (
            <div class="debug">
              

           <label style={{marginBottom:'10px' }}> 
              Ingredients Menu For A Dinner For <span title="nr guests">{props.people}</span> Guests:
              <button className="new-button" onClick={() => { window.location.hash = '#/search';}}>Back To Search Page</button>
           </label>


            
              
              <table style={{ width: '300px'}}>
                  {  //  <---- in JSX/HTML, with this curly brace, we go back to JavaScript, and make a comment
                  /*  The rest of the file is for TW1.5. If you are at TW1.2, wait!  */

                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>Aisle</th>
                    <th>Quantity</th>
                    <th>unit</th>
                  </tr>
                </thead>

                  }
                
                <tbody>
                  {  //  <---- in JSX/HTML, with this curly brace, we go back to JavaScript expressions
                      // TODO: un-comment and pass the CB below for array rendering!
                      sortIngredients(props.ingredients).map(ingredientTableRowCB)
                      // TODO once the table rendering works, sort ingredients before mapping. Import the needed function from utilities.js  
                  }
                </tbody>
              </table>
            </div>
    );
    /* for TW1.3 
      Note also that the callback can be defined after it is used! 
      This JS feature is called "function hoisting".
    */
    function ingredientTableRowCB(ingr){
        return <tr key={ingr.id } >
                <td className="right-align">{ingr.name}</td>
                <td className="right-align">{ingr.aisle}</td>
                <td className="right-align">{(props.people * ingr.amount).toFixed(2)}</td>
                <td className="right-align">{ingr.unit}</td>
              </tr>;
    }

    /* A key is a unique identifier for each item  */
}

export default SummaryView;
