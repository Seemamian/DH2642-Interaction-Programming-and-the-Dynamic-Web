import {sortDishes} from "/src/utilities.js";
import {menuPrice} from "/src/utilities.js";
import {dishType} from "/src/utilities.js";


import "/src/style.css"


function SidebarView(props) {  
  const sortedDishes = [...sortDishes(props.dishes)];
  const totalPrice = menuPrice(sortedDishes);
    return (
      <div className="debug">

        <button
          onClick={() => {props.onNumberChange(props.number - 1)}}
          disabled={props.number === 1}
        >
          -
        </button>

        <span> Dish Menu For </span>

        <span style={{  margin: '0 10px'}}> {props.number}  </span>

        <span> Guests : </span>


        <button
          onClick={() => {props.onNumberChange(props.number + 1)}}
        >
          +
        </button>



        <table style={{ marginTop: '20px' }}>

          <tbody>
          {sortedDishes.map((dish,index) => (
            <tr key={dish.id}>
               <td>
                <button className="XButton"
                onClick={() => {props.removeDish(dish)}}
                >
                  X
                </button>
              </td>
              <td>
                <a className="DishTitle" onClick={() => {props.getDishName(dish)}} href="#/details" >{dish.title}</a>
              </td>
              <td>{dishType(dish)}</td>
              <td className="Price right-align">
                {((dish.pricePerServing * props.number).toFixed(2))}
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td>Total:</td>
            <td></td>
            <td className="Price right-align">
              {(totalPrice * props.number).toFixed(2)}
            </td>
          </tr>
          </tbody>
        </table>
      </div>


    );
  }
  
  export default SidebarView;
  