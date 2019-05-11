const express = require('express');
const router = express.Router();


//USING product.js model
//Import mongoose
const mongoose = require('mongoose');
//import the product model schema here
const Product = require('../models/product');   //usage has been transferred to the controllers/products.js

//import orders controller
const ProductsController = require('../controllers/products');

//import the multer (image uploading)
const multer = require('multer');

//import route protection middleware
const checkAuth = require('../middleware/check-auth'); //this middle ware is used on the POST, PATCH and DELETE blocks. We don't
//need to use it with the GET block cos every user is required to view all products


//.....................................................................
//alter a new constant 'upload' to execute multer
// const upload = multer({dest: 'uploads/'});  //'uploads' is a folder where multer will try to store incoming files
//.....................................................................
//A better to way to execute multer using 'multer.diskStorage()'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {    //cb means 'callback'
        cb(null, './uploads/');  //'uploads' is a folder where multer will try to store incoming files
    },
    filename: function (req, file, cb) {
        // cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); ..............//Is either you do this
        cb(null, Date.now() + file.originalname);   //..............................................or this
    }
});
//additional filtering
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        //to accept file and store
        cb(null, true)
    } else {
        //to reject file and store
        cb(null, false)
    }
}

// const upload = multer({storage: storage});    //this will work, but no filtering
const upload = multer({
    storage: storage, limits: {   //this accepts filtering i.e 'limit to file size it accepts', additional filtering can be placed above this block like thatwe have above this block
        fileSize: 1024 * 1024 * 5       //.....means 5mb file limit
    }, fileFilter: fileFilter
});        //..............add the "fileFilter" property constant from above to the 



router.get('/', ProductsController.products_get_all);

// router.post('/', (req, res, next) => {
router.post('/', checkAuth, upload.single('productImage'), ProductsController.products_create_product)       //adding the multer middleware "upload.single()"

router.get('/:productid', ProductsController.products_get_product)

router.patch('/:productid', checkAuth, ProductsController.products_update_product)

router.delete('/:productid', checkAuth, ProductsController.products_delete_product);

module.exports = router;