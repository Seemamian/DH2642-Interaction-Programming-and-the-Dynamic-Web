import "/src/style.css"

function SearchFormView (props){
    return (
        <div class="debug" style={props.style}>
              <div class="input-group">

          <label style={{marginBottom:'10px' }}> Type Some Dish Name To Search For Below .. Or Move To Ingredients Menu By The "summry" Button ..           
            <button className="new-button" onClick={() => {window.location.hash = '#/summary';}}>summary</button>
          </label>

          <input className="text-input" type="text" value={props.text || ""} placeholder = {"Dish..."} onChange={(event) => props.onTextChange(event.target.value)} />

    
          <label>
            <select className="selector" value={props.type || ""} onChange={(event) => props.onTypeChange(event.target.value)}>
              <option value = "">Choose:</option>
              { props.dishTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
          </label>


          </div>
    
          <button class="submit-button" onClick={() => {props.searchButton()}}>Search!</button>

        </div>   
      );
}
export default SearchFormView;