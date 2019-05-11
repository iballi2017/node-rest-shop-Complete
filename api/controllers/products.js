//USING order.js model
//Import mongoose
const mongoose = require('mongoose');
//import the order model schema here
const Order = require('../models/order');
//import the product model schema
const Product = require('../models/product');


//To get all products
exports.products_get_all = (req, res, next) => {
    // res.status(200).json({
    //     message: "Handling GET requests to /products"
    // });
    Product.find()
        //to select the variable info concerned
        // .select('name price _id')  //to state which fields to select and display on the screen, without it, all fields will be displayed
        .select('name price _id productImage')      //........since we've now added image property, we need to allo productImage info on display
        .exec()
        .then(docs => {
            //console.log(docs);
            //the console.log(docs) above is actually displaying all fields on the screen, so to correct that
            const response = {
                count: docs.length,
                // products: docs
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,   //.....productImage is added this time
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            };


            //The commented if-else block statement can be used on when the array of products is empty, but it isn't necessary cos
            //it isn't an error if the array is empty.
            // if(docs.length >= 0){
            //     res.status(200).json(docs);
            // }else{
            //     res.status(404).json({
            //         message : "No entry found!"
            //     });
            // };


            // res.status(200).json(docs);         //old response without the counters
            res.status(200).json(response);   //this will display the new docs response, showing the counters above it
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}


//To post a product
exports.products_create_product = (req, res, next) => {
    console.log(req.file);

    //.......................................
    //To meet up the requirement to the body-parser, whenever we create a route, we should create
    //what the client is expected to have i.e create the "product"
    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };

    //the old product above is not needed again, so it is commented out
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        //adding image property to the model
        productImage: req.file.path
    });
    //we save the product info to store it in the database
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            // message: "Handling POST requests to /products",
            message: "Created Product Successfully!",  //Better object message
            //attach the created product here to be sent
            // createdProduct: result
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                //adding image property to the model
                productImage: req.file.path,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + result._id
                }
            }
        });
    })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

}

//To get a product information
exports.products_get_product = (req, res, next) => {
    const id = req.params.productid;
    // remove the dummy code below
    // if (id === 'special') {
    //     res.status(200).json({
    //         message: "You discovered a SPECIAL ID",
    //         id: id
    //     })
    // } else {
    //     res.status(200).json({
    //         message: "You passed an ID"
    //     })
    // }
    Product.findById(id)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            console.log("From database ", doc);
            if (doc) {
                // res.status(200).json(doc);
                res.status(200).json({
                    Product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products'
                    }
                });
            } else {
                res.status(404).json({
                    message: "No valid entry found for provided ID"
                });
            }
            // res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ err });
        });

}


//To patch(update) a product infomation
exports.products_update_product = (req, res, next) => {
    // res.status(200).json({
    //     message: "Updated product!",
    // })
    const id = req.params.productid;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.update({
        _id: id
    }, {
            $set: //{
                // name : req.body.newName,
                // price : req.body.newPrice
                //}
                updateOps  // this is a dynamic process that will change anything on the body, instead of the req.body.** aproach commented out above
        })
        .exec()
        .then(result => {
            // console.log(result); 
            // res.status(200).json({result})   .............//this code outputs all information
            //To output a well structured information
            res.status(200).json({
                message: 'Product Updated!!!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
}

//To delete a product
exports.products_delete_product = (req, res, next) => { 
    // res.status(200).json({
    //     message: "Deleted product!",
    // })
    const id = req.params.productid;
    Product.remove({
        _id: id
    })
        .exec()
        .then(result => {
            // res.status(200).json(result);
            res.status(200).json({
                message: 'Product Deleted!!!',
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/products',
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}