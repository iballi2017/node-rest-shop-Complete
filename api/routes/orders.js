const express = require('../../node_modules/express');
const router = express.Router();

//USING order.js model
//Import mongoose
const mongoose = require('mongoose');   //usage has been transferred to the "controllers/products.js" and "controllers/orders.js"

//import the order model schema here
const Order = require('../models/order');    //This has been copied to the controllers/orders file   i.e //usage has been transferred to the controllers/orders.js
//import orders controller
const OrdersController = require( '../controllers/orders');

//import the product model schema
const Product = require('../models/product');


//import route protection middleware
const checkAuth = require('../middleware/check-auth'); //this middleware is used on the POST, GET, PATCH and DELETE blocks.




//Handles incoming GET requests to /orders
router.get('/', checkAuth, OrdersController.orders_get_all);    //pass OrdersController.orders_get_all here to get the codes


//Handles incoming POST requests to /orders
router.post('/', checkAuth, OrdersController.orders_create_order);

//Handles incoming GET requests to /orders
router.get('/:orderId', checkAuth, OrdersController.orders_get_order);

//Handles incoming DELETE requests to /orders
router.delete('/:orderId', checkAuth, OrdersController.order_delete);


module.exports = router;