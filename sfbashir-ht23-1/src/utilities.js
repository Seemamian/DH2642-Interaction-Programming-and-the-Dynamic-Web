/* compare two ingredients, for sorting */
function compareIngredientsCB(ingredientA, ingredientB) {
    // Comparing the ingredient aisle
    if (ingredientA.aisle < ingredientB.aisle) {
        return -1; // ingredient A comes before ingredient B
    } else if (ingredientA.aisle > ingredientB.aisle) {
        return 1; // ingredient A comes after ingredient B
    }

    // If the aisles are the same, compare the names of the ingredients
    if (ingredientA.name < ingredientB.name) {
        return -1;
    } else if (ingredientA.name > ingredientB.name) {
        return 1;
    }

    return 0; // Ingredients are equal
}

/* 
  Use the above comparator callback to sort the given ingredient array.
  Note that sort() will change the original array. To avoid that, use [...ingredients] which creates a new array and spreads the elements of the `ingredients` array.
*/
function sortIngredients(ingredients){
    
    const sortedIngredients = [...ingredients].sort(compareIngredientsCB);
    return sortedIngredients;
}

// helper object for isKnownType and dish sorting
const dishTypeRanking={
    "starter":1,
    "main course":2,
    "dessert":3,
    "":0
};

function isKnownTypeCB(type){

    return !!dishTypeRanking[type];

    // TODO look up type in dishTypeRanking. In case it is found, return true (or truthy, i.e. anything not falsy, see below).
    // otherwise return falsy (false, 0, undefined, or "")
    // Remember the object[key] syntax! It returns undefined if the key is not present in the object.
    // Optional: using truthy / falsy you can write this without if() ! 
}

/* dish.dishTypes will contain an array of dish types, of which we have to pick one that is known.
  Pass isKnownTypeCB as a callback to `Array.find()` to determine the dish known type. 
  If a known type cannot be determined, return "" 
*/
function dishType(dish){
    if( dish.dishTypes && dish.dishTypes.length !== 0 ){
       return dish.dishTypes.find(isKnownTypeCB) || ""; // returns the first element in the array which mataches the isKnownTypeCB, thus wether the dish is known
    }
    return "";

}

/* 
   Write a sort() comparator callback that compares dishes by their type, 
   so that all starters come before main courses and main courses come before desserts 
*/
function oraganisingDishTypesCB(dishA, dishB){
   const typeA = dishTypeRanking[dishType(dishA)];
   const typeB = dishTypeRanking[dishType(dishB)];

   if (typeA <typeB ){
    return -1;
   }else if (typeA > typeB){
    return 1;
   }

   return 0;

    // use dishType(dishA) and dishType(dishB)
    // use dishTypeRanking to convert these types to integers
    // once you know the integers, simply compare them
    // return negative, 0 or positive, see Array.sort() documentation. Hint: a comparator for two numberrs can simply subtract them, rather than using if()
}

/* 
   Sort the dishes using the comparator callback above.
*/
function sortDishes(dishes){
    const newArray = [...dishes];
    return newArray.sort(oraganisingDishTypesCB);
}

/* 
   Given a menu of dishes, generate a list of ingredients. 
   If an ingredient repeats in several dishes, it will be returned only once, with the amount added up 
   
   As this is not an algorithm course, the function is mostly written but you have 2 callback passing TODOs.
*/
function shoppingList(dishes){
    const result={}; // object used as mapping between ingredient ID and ingredient object

    // we define the callback inside the function, though this is not strictly needed in this case. But see below.
    function keepJustIngredientsCB(dish){
        return dish.extendedIngredients;
    }
    
    // ingredientCB must be defined inside shopingList() because it needs access to `result`
    // you will often need to define a callback inside the function where it is used, so it has access to arguments and other variables
    function ingredientCB(ingredient){
        if(result[ingredient.id] === undefined){  // more general: !result[ingredient.id]
            // since result[ingredient.id] is not defined, it means that the ingredient is not taken into account yet
            // so we associate the ingredient with the ID
            result[ingredient.id]={...ingredient}; // duplicating
            
            // JS Notes about the line above:
            // 1)    result[ingredient.id] 
            // In JS object.property is the same as object["property"] but the second notation is more powerful because you can write
            // object[x]  where x=="property"
            
            // 2)    {...ingredient } creates a *copy* of the ingredient (object spread syntax)
            // we duplicate it because we will change the object below
        } else {
            // since result[ingredient.id] is not defined, it means that the ingredient has been encountered before.
            // so we add up the amount:
            result[ingredient.id].amount +=  ingredient.amount;
        }
    }

    const arrayOfIngredientArrays= dishes.map(keepJustIngredientsCB); //transforms an array of dishes to an array of ingredients, note that this is a nested array 
    const allIngredients= arrayOfIngredientArrays.flat(); // converts in into a simple array, by flattning it 
    allIngredients.forEach(ingredientCB); 

    // Note: the 3 lines above can be written as a function chain:
    // dishes.map(callback1).flat().forEach(callback2);

    // now we transform the result object into an array: we drop the keys and only keep the values
    return Object.values(result);
}


/* Given a dish array, calculate their total price with a map-reduce callback exercise */
function menuPrice(dishesArray){

    function calculatePriceCB (oneDish){
        return oneDish.pricePerServing; // pricePerServing is the dish price property
    }

    function sumTypesCB (type1, type2) {

        const sum = type1 + type2;
        return sum;
        
    }

    const arrayPrices= dishesArray.map(calculatePriceCB);
    const totalPrice = arrayPrices.reduce(sumTypesCB, 0);

    return totalPrice;
;    // TODO callback1: given a dish, return its price. Look in /test/dishesConst.js to find out the name of the dish price property. 
    // TODO callback2, with two parameters. Return the sum of the parameters
    // TODO set proper names to the callbacks!
    
    // TODO 1) call dishesArray.map() with callback1 as argument. This will return an array of prices.
    // TODO 2) on the array of prices, call reduce() with callback2 as first parameter, and 0 as second parameter (we compute the total starting from zero).
    //        This will produce the total price, which you return
}


/*
  At this point, all of TW1.1 tests should pass!
*/

export{ compareIngredientsCB, sortIngredients, isKnownTypeCB, dishType, sortDishes, shoppingList, menuPrice};


/*
  Optional: once you are done with the whole TW1, 
  if you want to learn more functional programming, you may want to rewrite shoppingList(dishes) 
  The unit tests will help you determine if xyour code is equivalent with the above.

  Problem: ingredientCB is not a pure function because it has a side effect: it changes the result object. 
  Instead, you can use reduce to produce the result object.

  allIngredients.reduce(amountReducerCB, {}), i.e. use an object as accumulator.
  
  To create new objects in the reducer CB, you can use either spread syntax {...object, other:property}  or Object.assign() 

  shoppingList() then becomes:
  return Object.values(dishes.map(callback1).flat().reduce(amountReducerCB, {}))
  
  And you can even move both callback definitions outside shoppingList() . Creating functions inside functions is more expensive 
  because the new function object is re-created and interpreted every time the enclosing function runs.
*/

