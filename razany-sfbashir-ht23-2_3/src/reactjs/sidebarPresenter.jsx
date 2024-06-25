import SidebarView from "../views/sidebarView.jsx";
import { observer } from "mobx-react-lite";


export default
observer(             // needed for the presenter to update (its view) when relevant parts of the model change
function sidebarPresenter(props){ 
    function setNumber(number) {
        props.model.setNumberOfGuests(number);
    }

    function removeDishACB(dish){
        props.model.removeFromMenu(dish);
    }

    function getDishNameACB(dish) {
        props.model.setCurrentDish(dish.id);
    }
    return <SidebarView onNumberChange = {setNumber} removeDish = {removeDishACB} getDishName = {getDishNameACB} number={props.model.numberOfGuests} dishes={props.model.dishes}/>;
    }
);
