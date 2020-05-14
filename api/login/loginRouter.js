const express = require('express');
const loginRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');
const Merchant = require('../models/merchant');
const jwt = require('jsonwebtoken');
const searchRouter = require('../Search/searchRouter');
const merchantRouter = require('../merchant/merchantRouter');




const authenticate = async (req, res, next) => {
    const reqUser = req.body
    if (reqUser.type === 'merchant') {
        reqUser.email = reqUser.email.toLowerCase();
        await Merchant.findOne({ email: reqUser.email }, async (err, user) => {
            if (err) {

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
const createGuest = async (req, res, next) => {
    const guestVar = Math.floor(Math.random() * 1000)
    const guestUser = {
        name: 'guest',
        email: `guest@${Date.now()}-${guestVar}`,
        password: guestVar,
        guest: true
    }
    await User(guestUser).save((err, response) => {
        if (err) {
            return next(err);
        } else {
            const accessToken = jwt.sign({
                expiresIn: "365 days",
                data: { id: response._id, email: response.email, type: 'user' }
            }, process.env.REACT_APP_JWT_SECRET);
            const cookieOptions = { httpOnly: true, expires: new Date(Date.now() + 24 * 365 * 1000 * 3600000), sameSite: "none" }
            res.cookie('JWT', accessToken, cookieOptions).json({ user:{ id: response._id, email: response.email, type: 'user'},guest: true })
            loginTimeStamp(response._id, 'user')
        }
    })
}


loginRouter.post('/', authenticate, (req, res, next) => {
    const accessToken = jwt.sign({
        expiresIn: "365 days",
        data: { id: req.user.id, email: req.user.email, type: req.type }
    }, process.env.REACT_APP_JWT_SECRET);
    const cookieOptions = { httpOnly: true, expires: new Date(Date.now() + 24 * 365 * 1000 * 3600000), sameSite: "none" }
    res.cookie('JWT', accessToken, cookieOptions).json({ id: req.user.id, email: req.user.email, type: req.type })
    loginTimeStamp(req.user.id, req.type).status(200);
});



loginRouter.delete('/', (req, res, next) => {
    res.clearCookie('JWT').send()
})

loginRouter.post('/authenticate', (req, res, next) => {
    const token = req.cookies.JWT
    if (!token) {
        return createGuest(req, res, next)
    } else {
        jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'bad token' });
            }
            loginTimeStamp(user.data.id, user.data.type)
            if (user.data.type == 'user') {
                User.findOne({ _id: user.data.id }, (err, response) => {
                    if (err) {
                        return next(err)
                    }
                    return res.status(200).json({ user: user.data, guest: response.guest })
                })
            } else {
                return res.status(200).json({ user: user.data });
            }
        })
    }
})

const authenticateMiddleware = (req, res, next) => {
    const token = req.cookies.JWT
    if (token === null) {
        return res.status(401).json({ message: 'no token found' })
    }
    jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'bad token' });
        }
        req.user = user.data;
        next()
    })

}
const userTypeChecker = (req, res, next) => {
    if (req.user.type === 'user') {
        return next()
    } else {
        res.status(403).send()
    }
}
const merchantTypeChecker = (req, res, next) => {
    if (req.user.type === 'merchant') {
        return next()
    } else {
        res.status(403).send()
    }
}
const loginTimeStamp = (id, type) => {
    const date = Date.now()
    if (type === 'merchant') {
        Merchant.updateOne({ _id: id }, { $push: { logins: date } }, (err, response) => {
            if (err) {
                return next(err)
            }
        })
    }
    if (type === 'user') {
        User.updateOne({ _id: id }, { $push: { logins: date } }, (err, response) => {
            if (err) {
                return next(err)
            }
        })

    }
}

loginRouter.use('/search', authenticateMiddleware, userTypeChecker, searchRouter);
loginRouter.use('/merchant', authenticateMiddleware, merchantTypeChecker, merchantRouter);



module.exports = loginRouter;