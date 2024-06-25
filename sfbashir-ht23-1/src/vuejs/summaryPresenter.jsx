import { shoppingList } from "../utilities.js";
import SummaryView from "../views/summaryView.jsx";

export default
function Summary(props){
    return <SummaryView people={props.model.numberOfGuests} ingredients={shoppingList(props.model.dishes)}/>;
}
