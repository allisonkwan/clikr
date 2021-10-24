'use strict'

// require express and bodyParser
const express = require('express');

// Import DB Connection
require("./config/db");

// create express app
const app = express();

// use bodyParser middleware on express app
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

// Import API route
var routes = require('./api/routes/todoRoutes'); //importing route
routes(app);

// define port to run express app
const port = process.env.PORT || 3000;

// Add endpoint
app.get('/', (req, res) => {
res.send("Hello World");
});

// Listen to server
app.listen(port, () => {

console.log(`Server running at http://localhost:${port}`);
});