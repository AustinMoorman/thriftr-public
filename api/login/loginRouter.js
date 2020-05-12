const express = require('express');
const loginRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Merchant = require('../models/merchant');
const safe = require('../../ignoredByGit');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const searchRouter = require('../Search/searchRouter');
const merchantRouter = require('../merchant/merchantRouter');

loginRouter.use(cookieParser())



const authenticate = async (req, res, next) => {
    const reqUser = req.body
    if (reqUser.type == 'merchant') {
        reqUser.email = reqUser.email.toLowerCase();
        await Merchant.findOne({ email: reqUser.email }, async (err, user) => {
            if (err) {
                console.log(err)
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: 'no user with that email' })
            }
            const match = await bcrypt.compare(reqUser.password, user.password)
            if (!match) {
                return res.status(401).json({ message: 'password incorrect' })
            }
            req.user = user;
            req.type = 'merchant';
            return next();
        })
    } else {
        reqUser.email = reqUser.email.toLowerCase();
        await User.findOne({ email: reqUser.email }, async (err, user) => {
            if (err) {
                console.log(err)
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: 'no user with that email' })
            }
            const match = await bcrypt.compare(reqUser.password, user.password)
            if (!match) {
                return res.status(401).json({ message: 'password incorrect' })
            }
            req.user = user;
            req.type = 'user';
            return next();
        })
    }
}


loginRouter.post('/', authenticate, (req, res, next) => {
    const accessToken = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
        data: { id: req.user.id, email: req.user.email, type: req.type }
    }, safe.JWTsecret);
    const cookieOptions = { httpOnly: true, expires: new Date(253402300000000) }
    res.cookie('JWT', accessToken, cookieOptions).json({ id: req.user.id, email: req.user.email, type: req.type })
    loginTimeStamp(req.user.id, req.type)
});



loginRouter.delete('/', (req, res, next) => {
    res.clearCookie('JWT').send()
})

loginRouter.post('/authenticate', (req, res, next) => {
    const token = req.cookies.JWT
    if (token == null) {
        return res.status(401).json({ message: 'no token found' })
    }
    jwt.verify(token, safe.JWTsecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'bad token' });
        }
        loginTimeStamp(user.data.id,user.data.type)
        return res.status(200).json({ user: user.data });
    })
})

const authenticateMiddleware = (req, res, next) => {
    const token = req.cookies.JWT
    if (token == null) {
        return res.status(401).json({ message: 'no token found' })
    }
    jwt.verify(token, safe.JWTsecret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'bad token' });
        }
        req.user = user.data;
        next()
    })

}
const userTypeChecker = (req,res,next) => {
    if(req.user.type == 'user'){
        next()
    }else{
        res.status(403).send()
    }
}
const merchantTypeChecker = (req,res,next) => {
    if(req.user.type == 'merchant'){
        next()
    }else{
        res.status(403).send()
    }
}
const loginTimeStamp = (id,type) => {
    const date = Date.now()
    if(type == 'merchant'){
        Merchant.updateOne({ _id: id }, { $push: { logins: date } }, (err, response) => {
            if(err){
                next(err)
            }
        })
    }
    if(type == 'user'){
        User.updateOne({ _id: id }, { $push: { logins: date } }, (err, response) => {
            if(err){
                next(err)
            }
        })

    }
}

loginRouter.use('/search', authenticateMiddleware, userTypeChecker, searchRouter);
loginRouter.use('/merchant', authenticateMiddleware, merchantTypeChecker, merchantRouter);



module.exports = loginRouter;