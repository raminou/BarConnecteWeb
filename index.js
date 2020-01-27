const Schema = require('validate');
const express = require('express');
const drink = require('./routes/drink');
const recipe = require('./routes/recipe');
const app = express();
const bodyParser  = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/drink', drink);
app.use('/recipe', recipe);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});

