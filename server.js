const express = require('express');
const apiRouter = require('./api/api');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3005;


require('dotenv').config()


//middleware
const cookieParser = require('cookie-parser');
const cors = require('cors')({origin: true,credentials: true});
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const morgan = require('morgan');
app.use(cookieParser());
app.use(cors);
app.use(bodyParser.json());
app.use(errorHandler());
app.use(morgan('dev'));


mongoose.connect(process.env.REACT_APP_MONGO_URL,{useUnifiedTopology: true, useNewUrlParser: true});

app.use('/api',apiRouter)

app.use(express.static(path.join(__dirname,'build')));

app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT}!`)
})
