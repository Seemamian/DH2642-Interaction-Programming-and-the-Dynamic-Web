import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, set} from "/src/teacherFirebase.js";

// Add relevant imports here 
// TODO

// Initialise firebase app, database, ref
// TODO

function observerRecap(/*TODO*/) {
    //TODO
}

function modelToPersistence(/* TODO */){
    // TODO return an object
}

function persistenceToModel(/* TODO */){
    // TODO return a promise
}

function saveToFirebase(model){
    // TODO
}
function readFromFirebase(model){
    // TODO
}
function connectToFirebase(model, watchFunction){
    // TODO
}
// Remember to uncomment the following line:
//export {modelToPersistence, persistenceToModel, saveToFirebase, readFromFirebase}

export default connectToFirebase;
