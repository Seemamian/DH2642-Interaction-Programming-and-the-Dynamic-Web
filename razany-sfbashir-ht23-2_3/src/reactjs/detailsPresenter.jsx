import DetailsView from "../views/detailsView";
import promiseNoData from "../views/promiseNoData";
import { observer } from "mobx-react-lite";


function checkDishExistence(currentDish, dishes) {
    for (let i = 0; i < dishes.length; i++) {
        if (dishes[i].id === currentDish) {
            return true; 
        }
    }
    return false; 
}




export default observer ( function DetailsPresenter(props){ 
    console.log(props.model)
    function addDishACB() {
        props.model.addToMenu(props.model.currentDishPromiseState.data)  
    }
    
    const dishToCheck = props.model.currentDish;
    const arrayDishes = props.model.dishes;
    
    return promiseNoData(props.model.currentDishPromiseState) || <DetailsView dishData ={props.model.currentDishPromiseState.data} guests = {props.model.numberOfGuests}  isDishInMenu = {checkDishExistence(dishToCheck,arrayDishes)} addDishToMenu = {addDishACB}/>
});
