const express = require('express');
const router = express.Router();
const {check , validationResult} = require('express-validator');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authenticate');

/*
    1. Register a User
    URL: 	/user/register
    Fields	name , email , password
    Method	POST
    Access	PUBLIC
 */
router.post('/register', [
    check('name').notEmpty().withMessage('User Name is Required'),
    check('email').isEmail().withMessage('Enter a proper Email'),
    check('password').isLength({min : 6}).withMessage('Enter a proper Password'),
] , async (request , response) => {
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({errors : errors.array()});
    }
    try {
        // read the form data
        let {name , email , password} = request.body;

        // user already exists or not
        let user = await User.findOne({email : email});
        if(user){
            return response.status(401).json({errors : [{msg : 'User already exists'}]});
        }
        // encode the password
        let salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password , salt);

        // avatar image for email
        let avatar = gravatar.url(email , {
            s : '200',
            r : 'G',
            d : 'mm'
        });

        // address of user
        let address = {
            flat : ' ' ,
            street : ' ',
            landmark : ' ',
            city : ' ',
            state : ' ',
            country : ' ',
            pin : ' ',
            mobile : ' '
        };

        // insert into database
        user = new User({name , email , password , avatar , address });
        user = await user.save();

        response.status(200).json({
            result : 'success',
            user : user
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : 'Server Error'}]});
    }
});

/*
    2. Login a User
    URL	/user/login
    Fields	email , password
    Method	POST
    Access	PUBLIC

 */
router.post('/login',[
    check('email').isEmail().withMessage('Enter a proper Email'),
    check('password').isLength({min : 6}).withMessage('Enter a proper Password')
], async (request , response) => {
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({errors : errors.array()});
    }
    try {
        // get the form data
        let {email , password} = request.body;

        // check email is exists or not
        let user = await User.findOne({email : email});
        if(!user){
            return response.status(401).json({ errors : [ {msg : 'Invalid Credentials'}]});
        }
        // verify the password
        let isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch){
            return response.status(401).json({ errors : [ {msg : 'Invalid Credentials'}]});
        }
        // create a token and send to client
        let payload = {
            user : {
                id : user.id
            }
        };
        jwt.sign(payload, process.env.JWT_SECRET_KEY, (err, token) => {
            if(err) throw err;
            response.status(200).json({
                result : 'Login Success',
                token : token
            });
        });
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : 'Server Error'}]});
    }
});

/*
    3. Get User Info
    URL	/user/
    Fields	No-fields
    Method	GET
    Access	PRIVATE

 */
router.get('/', authenticate , async (request , response) => {
    // Get User Info logic
    try {
        let user = await User.findById(request.user.id).select('-password');
        response.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : 'Server Error'}]});
    }
});

/*
    4. Create / Update Address
    URL	/user/address
    Fields	flat , street , landmark , city , state , country , pin , mobile
    Method	POST
    Access	PRIVATE

 */
router.post('/address', [
    check('flat').notEmpty().withMessage('flat is required'),
    check('street').notEmpty().withMessage('Street is required'),
    check('landmark').notEmpty().withMessage('Landmark is required'),
    check('city').notEmpty().withMessage('City is required'),
    check('state').notEmpty().withMessage('State is required'),
    check('country').notEmpty().withMessage('Country is required'),
    check('pin').notEmpty().withMessage('PinCode is required'),
    check('mobile').notEmpty().withMessage('Mobile is required'),
], authenticate, async (request , response) => {
    // Create / Update Address logic
    let errors = validationResult(request);
    if(!errors.isEmpty()){
        return response.status(401).json({errors : errors.array()});
    }
    try {
        // get the form data
        let address = {
            flat : request.body.flat,
            street : request.body.street,
            landmark : request.body.landmark,
            city : request.body.city,
            state : request.body.state,
            country : request.body.country,
            pin : request.body.pin,
            mobile : request.body.mobile,
        };
        // get a user from database
        let user = await User.findById(request.user.id);
        user.address = address;
        user = await user.save(); // save user to database
        response.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        response.status(500).json({errors : [{msg : 'Server Error'}]});
    }
});

module.exports = router;
