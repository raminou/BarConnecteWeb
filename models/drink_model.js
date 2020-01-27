const Schema = require('validate');

const ingredients = ["water", "lemonade", "grenadine", "mint"];

const ingredients_model = new Schema({
    ingredients: [
        {
            name: {
                type: String,
                required: true,
                enum: ingredients
            },
            value: {
                type: Number,
                required: true
            }
        }
    ]
});

const drink_model = {
    id: {
        type: String,
        required: true
    },
    ingredients: ingredients_model
};

module.exports = {drink_model, ingredients_model, ingredients};