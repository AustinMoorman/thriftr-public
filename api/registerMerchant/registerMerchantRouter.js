const express = require('express');
const registerMerchantRouter = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Merchant = require('../models/merchant')
const MerchantBio = require('../models/merchantBio');


registerMerchantRouter.post('/verify-id', async (req, res, next) => {
    idToCheck = req.body.googleId;
    if (idToCheck) {
        await Merchant.findOne({ googleId: idToCheck }, (err, response) => {
            if (err) {
                return next(err);
            } else {
                if (response) {
                    res.status(304).send('location already has an account')
                } else {
                    res.status(200).send()
                }
            }
        })
    } else {
        res.status(403).send()
    }
})

registerMerchantRouter.post('/', async (req, res, next) => {
    let newMerchant = req.body;

    await Merchant.findOne({ googleId: newMerchant.place.googleId }, async (err, response) => {
        if (err) {
            return next(err)
        } else {
            if (response) {
                res.status(304).send('location already taken')
            } else {
                await Merchant.findOne({ email: newMerchant.email }, async (err, response) => {
                    if (err) {
                        return next(err);
                    } else {
                        if (response) {

                            res.status(304).send('email already taken')
                        } else {
                            const hashedPwd = await bcrypt.hash(newMerchant.password, 10);
                            newMerchant.password = hashedPwd;
                            newMerchant.email = newMerchant.email.toLowerCase();
                            await Merchant({
                                name: newMerchant.name,
                                googleId: newMerchant.place.googleId,
                                email: newMerchant.email,
                                password: newMerchant.password,
                                formattedAddress: newMerchant.place.formattedAddress,
                                location: {type: 'Point', coordinates: [Number(newMerchant.place.longitude),Number(newMerchant.place.latitude)]}
                            }).save(async (err, response) => {
                                if (err) {
                                    return next(err);
                                } else {
                                    await MerchantBio({
                                        name: response.name,
                                        merchantId: response.id,
                                        formattedAddress: response.formattedAddress,
                                        location: response.location
                                    }).save((err, response2) => {
                                        if (err) {
                                            return next(err)
                                        } else {
                                            res.status(201).json({ merchant: response });
                                        }
                                    })

                                }
                            })
                        }
                    }
                })
            }
        }
    })
})


module.exports = registerMerchantRouter;