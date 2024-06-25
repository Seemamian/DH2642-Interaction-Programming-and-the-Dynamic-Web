import SidebarView from "../views/sidebarView.jsx";

export default
function SidebarPresenter(props){ 

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