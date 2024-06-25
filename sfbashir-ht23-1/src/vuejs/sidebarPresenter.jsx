import SidebarView from "../views/sidebarView.jsx";

export default
function SidebarPresenter(props){

    function changeNumber(number) {
        props.model.setNumberOfGuests(number);
    }
    function removDish(dish){
        props.model.removeFromMenu(dish);
    }
    function dishTitle(dish){
        props.model.setCurrentDish(dish.id);
    }
    return <SidebarView number={props.model.numberOfGuests} dishes={(props.model.dishes)} onNumberChange = {changeNumber} removeDish = {removDish} dishInfo = {dishTitle}/>;
}
