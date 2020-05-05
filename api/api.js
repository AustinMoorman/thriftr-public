const express = require('express');

const apiRouter = express.Router();

const registerRouter = require('./register/registerRouter')
const registerMerchantRouter = require('./registerMerchant/registerMerchantRouter');
const loginRouter = require('./login/loginRouter');

apiRouter.use('/register',registerRouter);
apiRouter.use('/register-merchant',registerMerchantRouter)
apiRouter.use('/login',loginRouter)

module.exports = apiRouter;