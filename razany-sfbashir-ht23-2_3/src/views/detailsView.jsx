import "/src/style.css"

function DetailsView(props){
    console.log(props)

    return (
<div class="debug">
    <div class="dish-details">
        <h2>{props.dishData.title}</h2>
        <p>Price per person: {(props.dishData.pricePerServing).toFixed(2)}</p>
        <p>Total price for {props.guests} guests: {(props.guests * props.dishData.pricePerServing).toFixed(2)}</p>
        <img src={props.dishData.image} alt={props.dishData.title} />
        {/* Add to menu button */}
        <button onClick={() => {props.addDishToMenu(props.dishData); window.location.hash = '#/search';}} disabled={props.isDishInMenu}>
            Add to menu
        </button>
        <button onClick={() => {window.location.hash = '#/search';}}>
            Cancel
        </button>
        <ul>
            {props.dishData.extendedIngredients.map((ingredient, index) => (
                <li key={index}>
                    {ingredient.name} : {ingredient.amount} {ingredient.unit}
                </li>
            ))}
        </ul>
        <p>{props.dishData.instructions}</p>
        <a href={props.dishData.sourceUrl}>More Information</a>
    </div>
</div>

        );

}

export default DetailsView;