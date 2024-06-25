import {sortDishes} from "/src/utilities.js";
import {menuPrice} from "/src/utilities.js";
import {dishType} from "/src/utilities.js";
import "/src/style.css"


function SideBarView(props) {    // takes props argument

  /*
  It sorts the dishes using the sortDishes function and calculates the total price using the menuPrice function. 
  It also creates a new array sortedDishes containing the sorted dishes.
  */
    const sortedDishes = [...sortDishes(props.dishes)];
    const totalPrice = menuPrice(sortedDishes); 

    // "debug" is from the style.css and is defined there for the borders
     return (
    <div className="debug">
      <button // defining a button: once clicked 
        onClick={() => props.onNumberChange(props.number - 1)} // setting up an event handler for when the buttom is clicked,
        disabled={props.number === 1}
      >
        -
      </button>

      <span>{props.number}</span> 

      <button onClick={() => props.onNumberChange(props.number + 1)}>+</button>

      <table>
        <tbody>
          {sortedDishes.map((dish, index) => (
            <tr key={dish.id}>
              <td>
                <button onClick={() => props.removeDish(dish)}>X</button>
              </td>
              <td>
                <a onClick={() => props.dishInfo(dish)} href="#">
                  {dish.title}
                </a>
              </td>
              <td>{dishType(dish)}</td>
              <td className="alignCorrect">
                {(dish.pricePerServing * props.number).toFixed(2)}
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td>Total:</td>
            <td></td>
            <td className="alignCorrect">
              {(totalPrice * props.number).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SideBarView;

      

  