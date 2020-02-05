const express = require('express');
const {ingredients_model, ingredients} = require('../models/drink_model');
const {initStatus, generateUuid} = require('../utils');

const router = express.Router();
let drinks = [];

const StatusEnum = Object.freeze({
    "queue": "queue",
    "prepare": "prepare",
    "done": "done",
    "served": "served",
    "error": "error"
});

function deleteDrink(id) {
    for(let i = 0; i < drinks.length; i++) {
        const drink = drinks[i];
        if(drink.id === id) {
            drinks.splice(i, 1);
            return true;
        }
    }

    return false;
}

function linkToDrink(id, ws) {
    for(let i = 0; i < drinks.length; i++) {
        const drink = drinks[i];
        if(drink.id === id) {
            drink.ws = ws;
            return true;
        }
    }
}

// Get List of drinks
router.get('/', function(req, res) {
    let status = initStatus(req, "List of drinks");
    status.data = drinks;
    res.json(status);
});

router.get('/first', function(req, res) {
    const contentType = req.header('accept');
    const drink = drinks[0];

    switch(contentType) {
        case "text/plain":
            let text = "";
            if(drink === undefined) 
                text = "NULL";
            else {
                for(let i = 0; i < ingredients.length; i++) {
                    const key = ingredients[i];
                    let find = false;
                    for(let j = 0; j < drink.ingredients.length; j++) {
                        const ing = drink.ingredients[j];
                        if(ing.name === key) {
                            find = true;
                            console.log(`\t${ing.name}: ${ing.value}`);
                            text += ing.value + ",";
                            break;
                        }
                    }

                    if(!find)
                        text += "0,";
                }
            }
            
            console.log(`SEND TEXT: ${text}`);
            res.set('Content-Type', 'text/plain');
            res.send(text);
            break;
        case "application/json":
        default:
            let status = initStatus(req, "First Drink");
            status.data = drinks[0];
            res.json(status);
    }
});

// Add Drink
router.put('/', function(req, res) {
    let drink_to_add = req.body;
    const errors = ingredients_model.validate(drink_to_add);
    if(errors.length === 0) {
        drink_to_add.id = generateUuid(req);
        drink_to_add.status = StatusEnum.queue;
        drink_to_add.ws = null;
        drinks.push(drink_to_add);

        let status = initStatus(req, "Drink added");
        status.data = {id: drink_to_add.id, status: drink_to_add.status};
        res.json(status);
    }
    else {
        let status = initStatus(req, "Error adding drink");
        for(let i = 0; i < errors.length; i++) {
            status.errors.push(errors[i].message);
        }
        res.status(400);
        res.json(status);
    }
});

// Delete Drink
router.delete('/:id', function(req, res) {
    let status = initStatus(req, "Deleted");
    if(!deleteDrink(req.params.id)) {
        res.status(400);
        status.message = "Nothing deleted !";
        status.errors.push("Id not found");
    }
    res.send(status);
});

// Reset List of drinks
router.get('/reset', function(req, res) {
    drinks = [];
    res.send(initStatus(req, "List of drinks reset"));
});

// Change status
router.post('/:id', function(req, res) {
    const newStatus = StatusEnum[req.body.status];
    let error = "";
    if(newStatus !== undefined) {
        for(let i = 0; i < drinks.length; i++) {
            const drink = drinks[i];
            if(drink.id === req.params.id) {
                drink.status = newStatus;
                res.send(initStatus(req, "Drink updated"));

                if(drink.ws !== null) {
                    try {
                        drink.ws.send(JSON.stringify({name: drink.name, status: drink.status, id: drink.id}));
                    } catch(error) { ; }
                }

                if(drink.status === StatusEnum.served) {
                    if(drink.ws !== null) {
                        try {
                            drink.ws.close();
                        } catch(error) { ; }
                    }
                    drinks.splice(i, 1);
                }

                return;
            }
        }
        error = "Id not found";
    }
    else
        error = "Status undefined";

    let status = initStatus(req, "No drink updated");
    status.errors.push(error);
    res.send(status);
    res.status(400);
});

module.exports = {router, linkToDrink};