const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authenticate = require('../middlewares/authenticate');
const {check , validationResult} = require('express-validator');

/*
    	1. Upload a Product
        URL	/product/upload
        Fields	name , brand , price , qty , image , category , description , usage
        Method	POST
        Access	PRIVATE
 */
router.post('/upload', [
    check('name').notEmpty().withMessage('Name is Required'),
    check('brand').notEmpty().withMessage('Brand is Required'),
    check('price').notEmpty().withMessage('Price is Required'),
    check('qty').notEmpty().withMessage('Qty is Required'),
    check('image').notEmpty().withMessage('Image is Required'),
    check('category').notEmpty().withMessage('Category is Required'),
    check('description').notEmpty().withMessage('Description is Required'),
    check('usage').notEmpty().withMessage('Usage is Required')
] , authenticate, async (request , response) => {
    // upload logic
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({errors : errors.array()});
    }
    try {
        // receive the form data
        let newProduct = {
            name : request.body.name,
            brand : request.body.brand,
            image : request.body.image,
            price : request.body.price,
            qty : request.body.qty,
            category : request.body.category,
            description : request.body.description,
            usage : request.body.usage,
        };
        // save to database
        let product = new Product(newProduct);
        product = await product.save();
        response.status(200).json({
            result : 'success',
            product : product
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : 'Server Error'}]});
    }
});

/*
   2. Get Men’s Collection
    URL	/product/men
    Fields	No-fields
    Method	GET
    Access	PUBLIC

 */
router.get('/men', async (request , response) => {
    // Get Men’s Collection	Logic
    try {
        let products = await Product.find({category : "MEN"});
        response.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : 'Server Error'}]});
    }
});

/*
    3. Get Women’s Collection
    URL	/product/women
    Fields	No-fields
    Method	GET
    Access	PUBLIC
 */
router.get('/women', async (request , response) => {
    // Get Women’s Collection	Logic
    try {
        let products = await Product.find({category : "WOMEN"});
        response.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : 'Server Error'}]});
    }
});

/*
    4. Get Kid’s Collection
    URL	/product/kids
    Fields	No-fields
    Method	GET
    Access	PUBLIC

 */
router.get('/kids', async (request , response) => {
    // Get Kid’s Collection	Logic
    try {
        let products = await Product.find({category : "KIDS"});
        response.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : 'Server Error'}]});
    }
});

/*
    4. Get Kid’s Collection
    URL	/product/kids
    Fields	No-fields
    Method	GET
    Access	PUBLIC

 */
router.get('/kids', async (request , response) => {
    // Get Kid’s Collection	Logic
    try {
        let products = await Product.find({category : "KIDS"});
        response.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : 'Server Error'}]});
    }
});

/*
    5. Get a Product
    URL	/product/:id
    Fields	No-fields
    Method	GET
    Access	PUBLIC

 */
router.get('/:id', async (request , response) => {
    // Get a Product
    try {
        let productId = request.params.id;
        let product = await Product.findById(productId);
        response.status(200).json(product);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : 'Server Error'}]});
    }
});

/*
    4. Get Kid’s Collection
    URL	/product/kids
    Fields	No-fields
    Method	GET
    Access	PUBLIC

 */
    router.get('/watch', async (request , response) => {
        // Get Kid’s Collection	Logic
        try {
            let products = await Product.find({category : "WATCH"});
            response.status(200).json(products);
        }
        catch (error) {
            console.error(error);
            response.status(500).json({errors : [{msg : 'Server Error'}]});
        }
    });

module.exports = router;
