import SearchFormView from "../views/searchFormView";
import promiseNoData from "../views/promiseNoData";
import SearchResultsView from "../views/searchResultsView";


export default function SearchPresenter(props){ 
    console.log(props.model)

    function setTextACB(text) {
        props.model.setSearchQuery(text)
    }

    function setTypeACB(type) {
        props.model.setSearchType(type)
    }

    function searchACB() {
        console.log(props.model.searchParams)
        
        props.model.doSearch(props.model.searchParams)
    }

    function showInfoACB(dish){
        props.model.setCurrentDish(dish.id)

    }

    return ( 
        <div>
        <SearchFormView
          text={props.model.searchParams?.query || ''}
          type={props.model.searchParams?.type || ''}
          dishTypeOptions={["starter", "main course", "dessert"]} 
          onTextChange = {setTextACB}
          onTypeChange = {setTypeACB}
          searchButton = {searchACB}
          style={{ marginBottom: '15px' }} 
        />
        {
        promiseNoData(props.model.searchResultsPromiseState) 
        || 
        <SearchResultsView 
        searchResults = {props.model.searchResultsPromiseState.data} 
        displayDishInfo = {showInfoACB}/>}
        </div>

      );

   
    
}
