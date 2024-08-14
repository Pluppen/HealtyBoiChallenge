const express = require('express');
const routes = require('./routes/index');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', routes);

module.exports = app;
