const express = require('express');
const { ingredients_model, drink_model } = './models/drink_model';
const { initStatus, generateUuid } = require('../utils');

const router = express.Router();

let recipes = [];

// Get the recipes
router.get('/', function(req, res) {
    let status = initStatus(req, "List of recipes");
    status.data = recipes;
    res.json(status);
});

// Put the receive
router.put('/', function(req, res) {
    let recipe_to_add = req.body;
    const errors = recipe_model.validate(recipe_to_add);
    if(errors.length === 0) {
        recipe_to_add.id = generateUuid(req);
        recipes.push(recipe_to_add);

        res.json(initStatus(req, "Recipe added"));
    }
    else {
        let status = initStatus(req, "Error adding recipe");
        for(let i = 0; i < errors.length; i++) {
            status.errors.push(errors[i].message);
        }
        res.status(400);
        res.json(status);
    }
});

module.exports = router;