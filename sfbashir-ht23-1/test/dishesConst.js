const dishesConst = [{
    id: 1,
    title: 'French toast',
    dishTypes: ['snack', 'appetizer'],
    pricePerServing: 21.34,
    summary: "In a large mixing bowl, beat the eggs. Add the milk, brown sugar and nutmeg; stir well to combine. Soak bread slices in the egg mixture until saturated. Heat a lightly oiled griddle or frying pan over medium high heat. Brown slices on both sides, sprinkle with cinnamon and serve hot.",
    extendedIngredients: [{
        id:1101,
        name: 'egg',
        unit: 'pcs',
        aisle: 'Egg & Dairy',
        amount: 1,
    },{
        id:1102,
        name: 'milk',
        amount: 30,
        unit: 'ml',
        aisle: 'Eggs & Dairy'
    }, {
        name: 'sugar',
        id: 1103,
        aisle: 'Baking',
        amount: 7,
        unit: 'g',
    }, {
        name: 'ground nutmeg',
        id: 1104,
        aisle: 'Baking',
        amount: 0.5,
        unit: 'g',
    }, {
        name: 'white bread',
        id: 1105,
        aisle: 'Bakery',
        amount: 2,
        unit: 'slices',
    }]
}, {
    id: 2,
    title: 'Sourdough Starter',
    pricePerServing: 11.22,
    dishTypes: ['starter', 'appetizer'],
    summary: "Here is how you make it... Lore ipsum...",
    extendedIngredients: [{
        name: 'egg',
        amount: 2,
        unit: 'pcs',
        aisle: 'Eggs & Dairy',
        id:1101
    },  {
        name: 'water activated dry yeast',
        aisle: 'Baking',
        id: 1106,
        amount: 0.5,
        unit: 'g',
    }, {
        id:1,
        name: 'water',
        aisle: '(home)',
        amount: 30,
        unit: 'ml',
    }, {
        name: 'flour',
        aisle: 'Baking',
        id: 1107,
        amount: 15,
        unit: 'g',
    }]
}, {
    id: 3,
    title: 'Baked Brie with Peaches',
    dishTypes: ['snack', 'starter'],
    pricePerServing: 10.81,
    summary: "Here is how you make it... Lore ipsum...",
    extendedIngredients: [{
        name: 'Brie cheese',
        id: 1108,
        aisle: 'Cheese',
        amount: 10,
        unit: 'g',
    }, {
        name: 'Raspberry',
        aisle: 'Produce',
        amount: 15,
        unit: 'pcs',
        id: 1109,
    }, {
        name: 'peaches',
        aisle: 'Produce',
        amount: 1,
        unit: 'pcs',
        id: 1110,
    }]
},{
    id: 4,
    title: '"Sour Cream Cucumbers"',
    dishTypes: ['antipasti', 'starter', 'snack'],
    pricePerServing: 17.51,
    summary: "If you have about 15 minutes to spend in the kitchen, Sour Cream Cucumbers might be an awesome gluten free and lacto ovo vegetarian recipe to try. For 60 cents per serving, you get a side dish that serves 8. One portion of this dish contains roughly 2g of protein, 3g of fat, and a total of 66 calories. 2408 people were impressed by this recipe. If you have pepper, cucumbers, sugar, and a few other extendedIngredients on hand, you can make it. It is brought to you by Taste of Home.",
    extendedIngredients: [{
        id: 1111,
        name: 'sour cream',
        aisle: 'Eggs & Dairy',
        amount: 150,
        unit: 'g',
    }, {
        id: 1112,
        aisle: 'Spices',
        name: 'vinegar',
        amount: 30,
        unit: 'ml',
    }, {
        id: 1113,
        aisle: 'Spices',
        name: 'pepper',
        amount: 7,
        unit: 'g',
    }, {
        id: 1103,
        name: 'sugar',
        aisle: 'Baking',
        amount: 0.5,
        unit: 'g',
    }, {
        id: 1114,
        name: 'cucumbers',
        aisle: 'Produce',
        amount: 1,
        unit: 'pcs',
    }]
}, {
    id: 100,
    title: 'Meat balls',
    dishTypes: ['lunch', 'dinner', 'main course', 'main dish'],
    pricePerServing: 82.41,
    summary: "Preheat an oven to 400 degrees F (200 degrees C). Place the beef into a mixing bowl, and season with salt, onion, garlic salt, Italian seasoning, oregano, red pepper flakes, hot pepper sauce, and Worcestershire sauce; mix well. Add the milk, Parmesan cheese, and bread crumbs. Mix until evenly blended, then form into 1 1/2-inch meatballs, and place onto a baking sheet. Bake in the preheated oven until no longer pink in the center, 20 to 25 minutes.",
    extendedIngredients: [{
        id:1101,
        name: 'egg',
        unit: 'pcs',
        aisle: 'Eggs & Dairy',
        amount: 3,
    }, {
        id: 1,
        aisle: '(home)',
        name: 'water',
        amount: 50,
        unit: 'ml',
    }, {
        aisle: 'Meat',
        name: 'extra lean ground beef',
        amount: 115,
        unit: 'g',
        id: 1115,
    }, {
        aisle: 'Spices',
        name: 'sea salt',
        amount: 0.5,
        unit: 'g',
        id: 1116,
    }, {
        aisle: 'Produce',
        name: 'small onion, diced',
        amount: 0.25,
        unit: 'pcs',
        id: 1117,
    }, {
        name: 'garlic salt',
        aisle: 'Spices',
        amount: 0.5,
        unit: 'g',
        id: 1118,
    }, {
        name: 'Italian seasoning',
        aisle: 'Spices',
        amount: 0.5,
        unit: 'g',
        id: 1119,
    }, {
        name: 'dried oregano',
        aisle: 'Spices',
        amount: 0.5,
        unit: 'g',
        id: 1120,
    }, {
        name: 'crushed red pepper flakes',
        aisle: 'Spices',
        amount: 0.5,
        unit: 'g',
        id: 1121,
    }, {
        name: 'Worcestershire sauce',
        aisle: 'Spices',
        amount: 6,
        unit: 'ml',
        id: 1122,
    }, {
        name: 'milk',
        aisle: 'Eggs & Dairy',
        amount: 20,
        unit: 'ml',
        id: 1102,
    }, {
        aisle: 'Cheese',
        name: 'grated Parmesan cheese',
        amount: 5,
        unit: 'g',
        id: 1124,
    }, {
        aisle: 'Baking',
        name: 'seasoned bread crumbs',
        amount: 15,
        unit: 'g',
        id: 1125,
    }]
}, {
    id: 200,
    title: 'Chocolate Ice cream',
    dishTypes: ['brunch', 'dessert'],
    pricePerServing: 16.42,
    summary: "Here is how you make it... Lore ipsum...",
    extendedIngredients: [{
        aisle: 'Frozen',
        name: 'ice cream',
        id: 1126,
        amount: 100,
        unit: 'ml',
    },  {
        aisle: 'Baking',
        name: 'black chockolate',
        id: 1127,
        amount: 150,
        unit: 'g',
    }]
}, {
    id: 201,
    title: 'Vanilla Ice cream',
    pricePerServing: 15.22,
    dishTypes: ['dessert', 'breakfast', 'brunch'],
    summary: "Here is how you make it... Lore ipsum...",
    extendedIngredients: [{
        aisle: 'Frozen',
        name: 'ice cream',
        id: 1126,
        amount: 100,
        unit: 'ml',
    },{
        aisle: 'Spices',
        name: 'vanilla bean',
        id: 1128,
        amount: 3,
        unit: 'pcs',
    }]
}, {
    id: 202,
    title: 'Strawberry ice cream',
    pricePerServing: 14.29,
    summary: "Here is how you make it... Lore ipsum...",
    extendedIngredients: [{
        aisle: 'Frozen',
        name: 'ice cream',
        id: 1126,
        amount: 150,
        unit: 'ml',
    }, {
        aisle: 'Produce',
        name: 'strawberry',
        id: 1129,
        amount: 5,
        unit: 'pcs',
    } ]
}
                    ];

function getDishDetails(x){ return dishesConst.find(function(d){ return d.id===x;});}

dishesConst.dishes1= [getDishDetails(2), getDishDetails(100), getDishDetails(200)];
dishesConst.dishes2= [getDishDetails(2), getDishDetails(100)];
dishesConst.dishes3 = [getDishDetails(200), getDishDetails(100), getDishDetails(2), getDishDetails(1)];



dishesConst.ingrList1= [{"id":1,"name":"water","aisle":"(home)","amount":80,"unit":"ml"},{"name":"egg","amount":5,"unit":"pcs","aisle":"Eggs & Dairy","id":1101},{"name":"milk","aisle":"Eggs & Dairy","amount":20,"unit":"ml","id":1102},{"name":"water activated dry yeast","aisle":"Baking","id":1106,"amount":0.5,"unit":"g"},{"name":"flour","aisle":"Baking","id":1107,"amount":15,"unit":"g"},{"aisle":"Meat","name":"extra lean ground beef","amount":115,"unit":"g","id":1115},{"aisle":"Spices","name":"sea salt","amount":0.5,"unit":"g","id":1116},{"aisle":"Produce","name":"small onion, diced","amount":0.25,"unit":"pcs","id":1117},{"name":"garlic salt","aisle":"Spices","amount":0.5,"unit":"g","id":1118},{"name":"Italian seasoning","aisle":"Spices","amount":0.5,"unit":"g","id":1119},{"name":"dried oregano","aisle":"Spices","amount":0.5,"unit":"g","id":1120},{"name":"crushed red pepper flakes","aisle":"Spices","amount":0.5,"unit":"g","id":1121},{"name":"Worcestershire sauce","aisle":"Spices","amount":6,"unit":"ml","id":1122},{"aisle":"Cheese","name":"grated Parmesan cheese","amount":5,"unit":"g","id":1124},{"aisle":"Baking","name":"seasoned bread crumbs","amount":15,"unit":"g","id":1125},{"aisle":"Frozen","name":"ice cream","id":1126,"amount":100,"unit":"ml"},{"aisle":"Baking","name":"black chockolate","id":1127,"amount":150,"unit":"g"}];


dishesConst.ingrList2= [{"id":1,"name":"water","aisle":"(home)","amount":80,"unit":"ml"},{"name":"egg","amount":5,"unit":"pcs","aisle":"Eggs & Dairy","id":1101},{"name":"milk","aisle":"Eggs & Dairy","amount":20,"unit":"ml","id":1102},{"name":"water activated dry yeast","aisle":"Baking","id":1106,"amount":0.5,"unit":"g"},{"name":"flour","aisle":"Baking","id":1107,"amount":15,"unit":"g"},{"aisle":"Meat","name":"extra lean ground beef","amount":115,"unit":"g","id":1115},{"aisle":"Spices","name":"sea salt","amount":0.5,"unit":"g","id":1116},{"aisle":"Produce","name":"small onion, diced","amount":0.25,"unit":"pcs","id":1117},{"name":"garlic salt","aisle":"Spices","amount":0.5,"unit":"g","id":1118},{"name":"Italian seasoning","aisle":"Spices","amount":0.5,"unit":"g","id":1119},{"name":"dried oregano","aisle":"Spices","amount":0.5,"unit":"g","id":1120},{"name":"crushed red pepper flakes","aisle":"Spices","amount":0.5,"unit":"g","id":1121},{"name":"Worcestershire sauce","aisle":"Spices","amount":6,"unit":"ml","id":1122},{"aisle":"Cheese","name":"grated Parmesan cheese","amount":5,"unit":"g","id":1124},{"aisle":"Baking","name":"seasoned bread crumbs","amount":15,"unit":"g","id":1125}];

function deepFreeze(object) {
    // Retrieve the property names defined on object
    const propNames = Object.getOwnPropertyNames(object);

    // Freeze properties before freezing self

    for (const name of propNames) {
        const value = object[name];

        if (value && typeof value === "object") {
            deepFreeze(value);
        }
    }

    return Object.freeze(object);
}

deepFreeze(dishesConst);

export default dishesConst;
