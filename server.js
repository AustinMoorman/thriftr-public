const express = require('express');

const apiRouter = require('./api/api');

const mongoose = require('mongoose');
const path = require('path');
const safe = require('./ignoredByGit');

const app = express();
const PORT = 3005;





//middleware
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const morgan = require('morgan');
app.use(cors({origin: true,credentials: true}));
app.use(bodyParser.json());
app.use(errorHandler());
app.use(morgan('dev'));


mongoose.connect(safe.mongoURL,{useUnifiedTopology: true, useNewUrlParser: true});

app.use('/api',apiRouter)

app.listen(PORT, () => {
    console.log(`Server is up and running on ${PORT}!`)
})