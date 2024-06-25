import "/src/style.css"

function SearchResultsView (props){
    return (
        <div className="search-results debug">
        {props.searchResults.map((result, index) => (
            <span key={index} onClick={() => {props.displayDishInfo(result); window.location.hash = '#/details';}}>
                <div>{result.title}</div>
                <img src={result.image} height='100' />
            </span>
        ))}
    </div>
    

    );

}
export default SearchResultsView;
