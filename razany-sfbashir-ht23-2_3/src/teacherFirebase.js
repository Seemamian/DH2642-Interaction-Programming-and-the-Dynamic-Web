import * as x from "/test/mockFirebase.js";
import * as y from "firebase/database";

/* Detects whether we are in a testing environment. If so, it returns a mock firebase, for testing. Otherwise it returns the real firebase. */

let z;
try{
    mocha
    z=x;
}catch(e){
    z=y;
}
const { getDatabase, ref, get, set, onValue, child, onChildAdded, onChildRemoved, off} =z;
export  { getDatabase, ref, get, set, onValue, child, onChildAdded, onChildRemoved, off};


