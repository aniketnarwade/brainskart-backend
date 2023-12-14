const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const Order = require('../models/Order');
const User = require('../models/User');
const {check , validationResult} = require('express-validator');

/*
    	1. To Place an Order
        URL	/order/
        Fields	items , tax , total
        Method	POST
        Access	PRIVATE

 */
router.post('/',[
    check('items').notEmpty().withMessage('please provide items'),
    check('tax').notEmpty().withMessage('please provide tax'),
    check('total').notEmpty().withMessage('please provide total'),
] , authenticate , async (request , response) => {
    // To Place an Order logic
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({errors : errors.array()});
    }
    try {
        // get user info from database
        let user = await User.findById(request.user.id); // id received from token thru authenticate.js
        // create an order & save to DB
        let order = new Order({
            name : user.name,
            email : user.email,
            mobile : user.address.mobile,
            items : request.body.items,
            tax : request.body.tax,
            total : request.body.total
        });
        order = await order.save();
        response.status(200).json({
            result : 'success',
            order : order
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : 'Server Error'}]});
    }
});

/*
    2. To Get All Orders
    URL	/order
    Fields	No-fields
    Method	GET
    Access	PRIVATE
 */
router.get('/', authenticate, async (request , response) => {
    // To Get All Orders	Logic
    try {
        let orders = await Order.find();
        response.status(200).json({
            result : 'success',
            orders : orders
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : 'Server Error'}]});
    }
});

module.exports = router;
