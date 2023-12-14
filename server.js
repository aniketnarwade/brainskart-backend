const express = require('express');
const app = express();
const cors = require('cors');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

// configure cors with express
app.use(cors());

// configure express to accept form data
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// configure dotEnv
dotEnv.config({path : './config/config.env'});

const port = process.env.PORT || 5000;

// connect to Mongo DB
mongoose.connect(process.env.MONGODB_CLOUD_URL, {
    useUnifiedTopology : true,
    useNewUrlParser : true,
    useFindAndModify : false,
    useCreateIndex : true
}).then((response) => {
    console.log('Connected to Mongo DB Successfully..............');
}).catch((error) => {
    console.error(error);
    process.exit(1); // stops the node js process
});

// for React Application Home Page
app.use(express.static(path.join(__dirname , 'client' , 'build')));
app.get('/', (request,response) => {
    response.sendFile(path.join(__dirname , 'client' , 'build' , 'index.html'));
});

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , 'client' , 'build')));
    app.get('/', (request,response) => {
        response.sendFile(path.join(__dirname , 'client' , 'build' , 'index.html'));
    });
}

// Router Configuration
app.use('/user', require('./router/userRouter'));
app.use('/product', require('./router/productRouter'));
app.use('/order', require('./router/orderRouter'));
app.use('/payment', require('./router/paymentRouter'));


// listen to Port
// http://127.0.0.1:5000
app.listen(port, () => {
    console.log(`Express Server is started on port ${port}`);
});
