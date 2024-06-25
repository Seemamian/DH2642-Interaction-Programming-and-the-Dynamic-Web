import { BASE_URL, API_KEY} from "./apiConfig";

function HTTPResponseACB(response) {
    if (response.status != 200) { 
        throw new Error("Response was not 200 " + response.status);
    }
    return response.json();
}

function objectArrayACB(dishArray) {
    console.log(dishArray);
    return dishArray[0];
}

function backToArrayACB(searchResult) {
    return searchResult.results;
}

export function getMenuDetails(array_of_dish_ids){
    const dishIDs = array_of_dish_ids.join(",");
    const url = BASE_URL + 'recipes/informationBulk?ids=' + dishIDs;
    return fetch(url, {
        method: 'GET',
        headers: {
            'X-Mashape-Key': API_KEY,
        }
    }).then(HTTPResponseACB);    
}

export function getDishDetails(id) {
    return getMenuDetails([id]).then(objectArrayACB);
}

export function searchDishes(searchParams){
    const newSearchParams = new URLSearchParams(searchParams).toString();
    const url = BASE_URL + 'recipes/complexSearch?' + newSearchParams;
    return fetch(url, {
        method: 'GET',
        headers: {
            'X-Mashape-Key': API_KEY,
        }
    }).then(HTTPResponseACB).then(backToArrayACB); 
} 
