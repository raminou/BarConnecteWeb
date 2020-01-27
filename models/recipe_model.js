const Schema = require('validate');
const {ingredients_model} = require('./drink_model');

const recipe_model = {
    name: {
        type: String,
        required: true
    },
    ingredients: ingredients_model
};

module.exports = {recipe_model};