const express = require('express');
const {ingredients_model, drink_model} = require('../models/drink_model');
const {initStatus, generateUuid} = require('../utils');

const router = express.Router();
let drinks = [];

// Get List of drinks
router.get('/', function(req, res) {
    let status = initStatus(req, "List of drinks");
    status.data = drinks;
    res.json(status);
});

// Add Drink
router.put('/', function(req, res) {
    let drink_to_add = req.body;
    const errors = ingredients_model.validate(drink_to_add);
    if(errors.length === 0) {
        drink_to_add.id = generateUuid(req);
        drinks.push(drink_to_add);

        res.json(initStatus(req, "Drink added"));
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
    let message = "Nothing deleted";
    let deleted = false;
    
    console.log("params:", req.params.id);
    
    for(let i = 0; i < drinks.length; i++) {
        const drink = drinks[i];
        console.log(drink.id, "==", req.params.id);
        if(drink.id === req.params.id) {
            message = `${drink.id} deleted`;
            drinks.splice(i, 1);
            deleted = true;
            break;
        }
    }

    let status = initStatus(req, message);
    if(!deleted) {
        res.status(400);
        status.errors.push("Id not found");
    }
    res.send(status);
});

// Reset List of drinks
router.get('/reset', function(req, res) {
    drinks = [];
    res.send(initStatus(req, "List of drinks reset"));
});

module.exports = router;