import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set} from "/src/teacherFirebase.js";
import firebaseConfig from "/src/firebaseConfig.js";
import { getMenuDetails } from "./dishSource";

// Initialise firebase app, database, ref
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const PATH = "dinnerModel83";
const rf = ref(db,PATH);

// Set a dummy string in the test path for checking initialization
//set(ref(db, PATH + "/test"), "dummy");


//takes the data from the model and saves it in the datbase. It takes the model with ex. dishes and number of guests
function modelToPersistence(model) {
    function transformerCB(dish){// takes a dish and returns just the dish id
        return dish.id;
    }
    console.log(model);

    const dishIds = model.dishes.map(transformerCB); //maps to a new array
    dishIds.sort((a, b) => a - b);  // sorts the array of dish ids, so that the are sorted as they are on the website

    //perceistice objects contains all the data needed to send to the database.
    const persistenceObject = {
    numberOfGuests: model.numberOfGuests,
    dishes: dishIds,
    currentDish: model.currentDish
  };
  
  return persistenceObject; 
}

// takes the data from the database and converts it to one that the model can read
function persistenceToModel(data, model) {
    // TODO return a promise
    data = data || {}; // either we have an object with the data or an empty object
    data.dishes = data.dishes || []; // either we have the dishes or a empty array 

    model.numberOfGuests = data.numberOfGuests || 2; // takes the data from the databsae else default is 2. We set this to the model
    model.currentDish = data.currentDish || null;

    return getMenuDetails(data.dishes) // now we arent only intrested in the dish ID's but rather the dishes.
    .then(result => {
        model.dishes = result;
    });
}

//Checks if the model is in a "ready" state.
//If ready, it saves the model's data to the Firebase database using the set function.

function saveToFirebase(model) {
    console.log(model.ready);
    if (model.ready) {
      set(rf,modelToPersistence(model)); // sends the data to the database. Note that rf is the path and model is the data
    }
}

function readFromFirebase(model) {
   model.ready = false;  //indicates that the data is not yet ready
   return get(ref(db, PATH)) // fetches the data from the database 
        .then((snapshot) => {
            return persistenceToModel(snapshot.val(), model);  //once the data is recieved it covnerts the data percistenceTOmodel to update the mode
        })
        .then(() => {
            model.ready = true;  // sets ready to true once is it updated
        });
}

function connectToFirebase(model, watchFunction) {
    function checkACB(){
        const data = [model.numberOfGuests, model.dishes, model.currentDish];
        return data; // returns an array of relevent data 
    }
    function effectACB(){
       saveToFirebase(model);  // saves data to the databsae by calling on save to firebase 
    }
    readFromFirebase(model);
    watchFunction(checkACB,effectACB); // watch function that triggers effectACB whenever checkACB returns different data. So checks changes in the model.
}

// Remember to uncomment the following line:
export {modelToPersistence, persistenceToModel, saveToFirebase,readFromFirebase}

export default connectToFirebase;
