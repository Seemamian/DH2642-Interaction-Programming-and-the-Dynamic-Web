import { assert, expect } from "chai";

function url2ExampleResults(url){
    return {results:searchResults};
}
function mySearchFetch(fetchURL, fetchParam, url2Results=url2ExampleResults){
    mySearchFetch.lastFetch=fetchURL;
    mySearchFetch.lastParam= fetchParam;
    const ret= url2Results(fetchURL);
    const delay= ret.delay ||0;
    return Promise.resolve({
        ok:true,
        status:200,
        json(){
            return mySearchFetch.lastPromise=new Promise(resolve => setTimeout(resolve, delay)).then(()=> ret);
        }
    });
}

function url2MockDishes(url){
    const q= url.indexOf("?");
    if(q==-1)
        throw new Error("could not find a query string in " +url);
    const search= new URLSearchParams(url.slice(q));
    if(search.get("ids")=="")
        return [];
    if(!search.get("ids"))
        throw new Error("expected ids parameter");
    return search.get("ids").split(",").map(x=>({id:+x}));
}
function myDetailsFetch(fetchURL, fetchParam, url2Dishes=url2MockDishes){
    myDetailsFetch.lastFetch=fetchURL;
    myDetailsFetch.lastParam= fetchParam;
    return Promise.resolve({
        ok:true,
        status:200,
        json(){
            return Promise.resolve(url2Dishes(fetchURL));
        }
    });
}

const message= `fetch() will stop working now, because the last 10 fetches were made in less than 15 miliseconds.
The code is still in an infinite re-render/infinite loop, and that will heat up your CPU.
To stop that, open Developer Tools and Reload ASAP. Then the code will pause. Check the Call Stack!
Look for useEffect() with no second parameter, or for state changes during render, since that triggers re-render.
`;

const lastFetch=[{time:Date.now()}];
async function withMyFetch(theFetch, f, url2Result, maxAllowed=1){
    const oldFetch= fetch;
    //let fetches=0;
    window.fetch= function(url, param){
        lastFetch.push({url, time:Date.now()});
        //    fetches++;if(fetches>maxAllowed) throwErrorFetch();
        if(lastFetch.length>10 && lastFetch.slice(-1)[0].time-lastFetch.slice(-10)[0].time<15){
            const fetches= lastFetch.slice(-10).map(x=>x.url+"\n").join("");
            console.warn("Execution will now pause because the last 10 fetches were made in less than 15 miliseconds. URLs below. \nCheck the **Call Stack** to see where the offending call comes from!\n "+fetches);
            debugger;
            document.body.innerText=message+fetches;
            throw new Error(message+fetches);
        }
        return theFetch(url.toString(), param, url2Result);
    };

    try{
        const result= f();
        await new Promise(resolve => setTimeout(resolve));  // need to wait a bit for the "fetch"
        return result;
    }
    catch(e){ console.error(e); }
    finally{ window.fetch=oldFetch; }
}

function findCGIParam(string, param,value){
    const cgi= new URLSearchParams({[param]:value}).toString();
    return string.indexOf(cgi+"&")!=-1 || string.endsWith(cgi) || (!value && string.indexOf(cgi)==-1);
}


function hash(s){ return s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0); }

function checkFetchUrl(url, param, [hashCode1, hashCode2], queryHash=[]){
    expect(url, "expected to perform  a fetch").to.be.ok;

    expect(param.headers, "should send a header for API authentication").to.be.ok;
    expect(Object.keys(param.headers).length, "only one header needed in the lab: the API key. Check the slides for the right header name and value, they are different from the API documentation.").to.equal(1);
    expect(Object.keys(param.headers).find(x=> hash(x.toLowerCase())===-1156464310 && hash(param.headers[x])===-182158098), "should send the correct API key as a header").to.be.ok;
    
    const group= url.indexOf("/group/");
    expect(group, "group/NNN should be part of the URI").to.be.gt(0);
    expect(url.substring(0, group), "API should be called via the indicated server").to.equal("https://brfenergi.se/iprog");
    const rest= url.substring(group+7);
    const endpoint= rest.indexOf("/");
    const queryString= rest.indexOf("?");
    expect(endpoint, "group/NNN should followed by endpoint").to.be.gt(0);
    
    const endpointStr= (queryString==-1?rest.substring(endpoint): rest.substring(endpoint, queryString)).toLowerCase();
    //console.log(endpointStr, hash(endpointStr));
    if(hash(endpointStr)!=hashCode1 && hash(endpointStr)!=hashCode2)
        expect.fail("Please find a more appropriate endpoint in the API documentation: "+endpointStr);
    let checked=false;
    if(queryString!=-1){
        const qs=rest.substring(queryString+1);
        if(qs){
            const queryParams= qs.split("&");        
            queryParams.forEach(function(y) {
                //console.log(y,hash(y));
                expect(queryHash.find(x=> hash(y)===x), "unexpected query string parameter-value "+y+" . It is strongly recommended to use URLSearchParams").to.be.ok;
            }
                               );
            expect(queryHash.length, "wrong number of query string parameters").to.equal(queryParams.length);
            checked=true;
        }
    }
    if(!checked && queryHash.length)
        expect.fail("expected "+queryHash.length+" query string parameters, found none");
}

export { withMyFetch, checkFetchUrl, myDetailsFetch, mySearchFetch, findCGIParam, searchResults, dishInformation};


const searchResults = [
  {
    id: 587203,
    title: "Taco Pizza",
    readyInMinutes: 20,
    servings: 6,
    sourceUrl: "https://laurenslatest.com/taco-salad-pizza-with-doritos/",
    openLicense: 0,
    image: "https://spoonacular.com/recipeImages/Taco-Salad-Pizza-with-Doritos-587203.jpg",
  },
  {
    id: 559251,
    title: "Breakfast Pizza",
    readyInMinutes: 25,
    servings: 6,
    sourceUrl: "http://www.jocooks.com/breakfast-2/breakfast-pizza/",
    openLicense: 0,
    image: "https://spoonacular.com/recipeImages/Breakfast-Pizza-559251.jpg",
  },
  {
    id: 556121,
    title: "Easy Vegetarian Sausage Basil Pizza",
    readyInMinutes: 30,
    servings: 4,
    sourceUrl: "https://dizzybusyandhungry.com/cashew-sausage-basil-pizza/",
    openLicense: 0,
    image: "https://spoonacular.com/recipeImages/Cashew-Sausage-Basil-Pizza-556121.png",
  },
];

const dishInformation = {
  "vegetarian": true,
  "vegan": true,
  "glutenFree": true,
  "dairyFree": true,
  "veryHealthy": true,
  "cheap": false,
  "veryPopular": false,
  "sustainable": false,
  "weightWatcherSmartPoints": 2,
  "gaps": "no",
  "lowFodmap": false,
  "preparationMinutes": 5,
  "cookingMinutes": 10,
  "aggregateLikes": 0,
  "spoonacularScore": 94.0,
  "healthScore": 100.0,
  "creditsText": "Food Faith Fitness",
  "sourceName": "Food Faith Fitness",
  "pricePerServing": 365.61,
  "extendedIngredients": [
    {
      "id": 11011,
      "aisle": "Produce",
      "image": "asparagus.png",
      "consistency": "solid",
      "name": "asparagus",
      "nameClean": "asparagus",
      "original": "1 3/4 Lb Asparagus (2 small bunches)",
      "originalString": "1 3/4 Lb Asparagus (2 small bunches)",
      "originalName": "Asparagus (2 small bunches)",
      "amount": 1.75,
      "unit": "Lb",
      "meta": [
        "(2 small bunches)"
      ],
      "metaInformation": [
        "(2 small bunches)"
      ],
      "measures": {
        "us": {
          "amount": 1.75,
          "unitShort": "Lb",
          "unitLong": "Lbs"
        },
        "metric": {
          "amount": 1.75,
          "unitShort": "Lb",
          "unitLong": "Lbs"
        }
      }
    },
    {
      "id": 4053,
      "aisle": "Oil, Vinegar, Salad Dressing",
      "image": "olive-oil.jpg",
      "consistency": "liquid",
      "name": "olive oil",
      "nameClean": "olive oil",
      "original": "1/2 Tbsp Olive oil",
      "originalString": "1/2 Tbsp Olive oil",
      "originalName": "Olive oil",
      "amount": 0.5,
      "unit": "Tbsp",
      "meta": [],
      "metaInformation": [],
      "measures": {
        "us": {
          "amount": 0.5,
          "unitShort": "Tbsps",
          "unitLong": "Tbsps"
        },
        "metric": {
          "amount": 0.5,
          "unitShort": "Tbsps",
          "unitLong": "Tbsps"
        }
      }
    },
    {
      "id": 11215,
      "aisle": "Produce",
      "image": "garlic.png",
      "consistency": "solid",
      "name": "garlic",
      "nameClean": "garlic",
      "original": "1/2 tsp Fresh garlic, minced",
      "originalString": "1/2 tsp Fresh garlic, minced",
      "originalName": "Fresh garlic, minced",
      "amount": 0.5,
      "unit": "tsp",
      "meta": [
        "fresh",
        "minced"
      ],
      "metaInformation": [
        "fresh",
        "minced"
      ],
      "measures": {
        "us": {
          "amount": 0.5,
          "unitShort": "tsps",
          "unitLong": "teaspoons"
        },
        "metric": {
          "amount": 0.5,
          "unitShort": "tsps",
          "unitLong": "teaspoons"
        }
      }
    },
    {
      "id": 11216,
      "aisle": "Produce;Ethnic Foods;Spices and Seasonings",
      "image": "ginger.png",
      "consistency": "solid",
      "name": "ginger",
      "nameClean": "ginger",
      "original": "1/2 tsp Fresh ginger, minced",
      "originalString": "1/2 tsp Fresh ginger, minced",
      "originalName": "Fresh ginger, minced",
      "amount": 0.5,
      "unit": "tsp",
      "meta": [
        "fresh",
        "minced"
      ],
      "metaInformation": [
        "fresh",
        "minced"
      ],
      "measures": {
        "us": {
          "amount": 0.5,
          "unitShort": "tsps",
          "unitLong": "teaspoons"
        },
        "metric": {
          "amount": 0.5,
          "unitShort": "tsps",
          "unitLong": "teaspoons"
        }
      }
    },
    {
      "id": 9206,
      "aisle": "Beverages",
      "image": "orange-juice.jpg",
      "consistency": "liquid",
      "name": "orange juice",
      "nameClean": "orange juice",
      "original": "1/4 Cup Orange juice (not from concentrate)",
      "originalString": "1/4 Cup Orange juice (not from concentrate)",
      "originalName": "Orange juice (not from concentrate)",
      "amount": 0.25,
      "unit": "cup",
      "meta": [
        "(not from concentrate)"
      ],
      "metaInformation": [
        "(not from concentrate)"
      ],
      "measures": {
        "us": {
          "amount": 0.25,
          "unitShort": "cups",
          "unitLong": "cups"
        },
        "metric": {
          "amount": 59.147,
          "unitShort": "ml",
          "unitLong": "milliliters"
        }
      }
    },
    {
      "id": 4058,
      "aisle": "Ethnic Foods",
      "image": "sesame-oil.png",
      "consistency": "liquid",
      "name": "sesame oil",
      "nameClean": "sesame oil",
      "original": "1/4 tsp Sesame oil",
      "originalString": "1/4 tsp Sesame oil",
      "originalName": "Sesame oil",
      "amount": 0.25,
      "unit": "tsp",
      "meta": [],
      "metaInformation": [],
      "measures": {
        "us": {
          "amount": 0.25,
          "unitShort": "tsps",
          "unitLong": "teaspoons"
        },
        "metric": {
          "amount": 0.25,
          "unitShort": "tsps",
          "unitLong": "teaspoons"
        }
      }
    },
    {
      "id": 2047,
      "aisle": "Spices and Seasonings",
      "image": "salt.jpg",
      "consistency": "solid",
      "name": "salt",
      "nameClean": "salt",
      "original": "1/8 tsp Salt",
      "originalString": "1/8 tsp Salt",
      "originalName": "Salt",
      "amount": 0.125,
      "unit": "tsp",
      "meta": [],
      "metaInformation": [],
      "measures": {
        "us": {
          "amount": 0.125,
          "unitShort": "tsps",
          "unitLong": "teaspoons"
        },
        "metric": {
          "amount": 0.125,
          "unitShort": "tsps",
          "unitLong": "teaspoons"
        }
      }
    }
  ],
  "id": 1445969,
  "title": "Asparagus Stir Fry",
  "readyInMinutes": 15,
  "servings": 2,
  "sourceUrl": "https://www.foodfaithfitness.com/asparagus-stir-fry/",
  "image": "https://spoonacular.com/recipeImages/1445969-556x370.jpg",
  "imageType": "jpg",
  "summary": "Need a <b>gluten free, dairy free, lacto ovo vegetarian, and vegan hor d'oeuvre</b>? Asparagus Stir Fry could be a tremendous recipe to try. For <b>$3.66 per serving</b>, this recipe <b>covers 27%</b> of your daily requirements of vitamins and minerals. One portion of this dish contains around <b>9g of protein</b>, <b>5g of fat</b>, and a total of <b>131 calories</b>. This recipe serves 2. 1 person were impressed by this recipe. It is brought to you by Food Faith Fitness. From preparation to the plate, this recipe takes approximately <b>15 minutes</b>. A mixture of asparagus, salt, garlic, and a handful of other ingredients are all it takes to make this recipe so scrumptious. With a spoonacular <b>score of 0%</b>, this dish is very bad (but still fixable). If you like this recipe, you might also like recipes such as <a href=\"https://spoonacular.com/recipes/asparagus-stir-fry-115129\">Asparagus Stir-Fry</a>, <a href=\"https://spoonacular.com/recipes/asparagus-stir-fry-405147\">Asparagus Stir-Fry</a>, and <a href=\"https://spoonacular.com/recipes/asparagus-tomato-stir-fry-387505\">Asparagus Tomato Stir-Fry</a>.",
  "cuisines": [],
  "dishTypes": [
    "antipasti",
    "starter",
    "snack",
    "appetizer",
    "antipasto",
    "hor d'oeuvre"
  ],
  "diets": [
    "gluten free",
    "dairy free",
    "lacto ovo vegetarian",
    "vegan"
  ],
  "occasions": [],
  "winePairing": {
    "pairedWines": [],
    "pairingText": "",
    "productMatches": []
  },
  "instructions": "Instructions\n\nBreak the asparagus to get the stalky parts off and thinly slice the asparagus diagonally\n\nHeat the olive oil in a medium pan on medium heat. Add in the asparagus and cook, stirring frequently, for 4-5 minutes until they are fork tender.\n\nAdd in the garlic and ginger and cook 1 minute. Then, add in the orange juice and simmer for 1 minute, or until evaporated.\n\nRemove from the heat and stir in the sesame oil and salt.\n\nDEVOUR!",
  "analyzedInstructions": [
    {
      "name": "",
      "steps": [
        {
          "number": 1,
          "step": "Break the asparagus to get the stalky parts off and thinly slice the asparagus diagonally",
          "ingredients": [
            {
              "id": 11011,
              "name": "asparagus",
              "localizedName": "asparagus",
              "image": "asparagus.png"
            }
          ],
          "equipment": []
        },
        {
          "number": 2,
          "step": "Heat the olive oil in a medium pan on medium heat.",
          "ingredients": [
            {
              "id": 4053,
              "name": "olive oil",
              "localizedName": "olive oil",
              "image": "olive-oil.jpg"
            }
          ],
          "equipment": [
            {
              "id": 404645,
              "name": "frying pan",
              "localizedName": "frying pan",
              "image": "pan.png"
            }
          ]
        },
        {
          "number": 3,
          "step": "Add in the asparagus and cook, stirring frequently, for 4-5 minutes until they are fork tender.",
          "ingredients": [
            {
              "id": 11011,
              "name": "asparagus",
              "localizedName": "asparagus",
              "image": "asparagus.png"
            }
          ],
          "equipment": [],
          "length": {
            "number": 5,
            "unit": "minutes"
          }
        },
        {
          "number": 4,
          "step": "Add in the garlic and ginger and cook 1 minute. Then, add in the orange juice and simmer for 1 minute, or until evaporated.",
          "ingredients": [
            {
              "id": 9206,
              "name": "orange juice",
              "localizedName": "orange juice",
              "image": "orange-juice.jpg"
            },
            {
              "id": 11215,
              "name": "garlic",
              "localizedName": "garlic",
              "image": "garlic.png"
            },
            {
              "id": 11216,
              "name": "ginger",
              "localizedName": "ginger",
              "image": "ginger.png"
            }
          ],
          "equipment": [],
          "length": {
            "number": 2,
            "unit": "minutes"
          }
        },
        {
          "number": 5,
          "step": "Remove from the heat and stir in the sesame oil and salt.",
          "ingredients": [
            {
              "id": 4058,
              "name": "sesame oil",
              "localizedName": "sesame oil",
              "image": "sesame-oil.png"
            },
            {
              "id": 2047,
              "name": "salt",
              "localizedName": "salt",
              "image": "salt.jpg"
            }
          ],
          "equipment": []
        },
        {
          "number": 6,
          "step": "DEVOUR!",
          "ingredients": [],
          "equipment": []
        }
      ]
    }
  ],
  "originalId": null
};


