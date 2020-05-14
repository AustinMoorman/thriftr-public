const express = require('express');
const searchRouter = express.Router()

const mongoose = require('mongoose');
const User = require('../models/users');
const Offer = require('../models/offer');
const MerchantBio = require('../models/merchantBio');
const Merchant = require('../models/merchant');

const request = require('request');


searchRouter.post('/Add-Location', async (req, res, next) => {

    const conditions = { _id: req.user.id }
    const update = { currentLocation: { longitude: req.body.longitude, latitude: req.body.latitude }, currentLocationOk: true }
    await User.updateOne(conditions, update, (err, response) => {
        if (err) {
            return res.status(400).send()
        } else {
            res.status(200).send()
        }
    })
})

searchRouter.post('/Add-Location-By-Zipcode', async (req, res, next) => {
    const zipcode = req.body.zipcode;

    request.get(`https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAvSwkP5aKgqIhubRUdI_2xYixBoshD9j0&components=postal_code:${zipcode}`, { json: true }, async (error, response, body) => {
        if (body.status === 'OK') {
            const latitude = body.results[0].geometry.location.lat
            const longitude = body.results[0].geometry.location.lng

            const conditions = { _id: req.user.id }
            const update = { currentLocation: { longitude: longitude, latitude: latitude } }
            await User.updateOne(conditions, update, (err, response) => {
                if (err) {
                    return res.status(400).send()
                } else {
                    res.status(200).json({ body: { latitude: latitude, longitude: longitude } })
                }
            })
        }
    })
})



searchRouter.post('/get-offers', (req, res, next) => {
    const resAmount = 5;
    const date = Date.now()
    const recentViewFrame = (date - (1000 * 60))
    const latitude = Number(req.body.latitude)
    const longitude = Number(req.body.longitude)
    const radius = Number(req.body.radius)
    const category = req.body.category

    let currentList = req.body.currentList

    currentList = currentList.map(offer => {
        return offer._id
    })
    console.log(currentList)

    let recentPastviews;
    let allViews
    let favoritedTags;
    let favoritedMerchant;
    let offerList;
    let bioList;
    let listToSend;


    const score = (off, favTags, favMerchant) => {
        const tags = off.tags
        if (favTags.length && tags.length) {
            let total = favTags.map(userTag => {
                let val = 0;
                tags.forEach(offerTag => {
                    if (userTag.tag === offerTag) {
                        val = userTag.occurance
                    }
                })
                return val
            })
            total = total.reduce((accumulator, currentValue) => accumulator + currentValue)
            if (favMerchant.includes(off.merchantId)) {
                total = total * 1.5
            }
            return total
        } else {
            return 0
        }
    }

    if (latitude && longitude && radius && category) {
        return User.findOne({ _id: req.user.id }, (err, response) => {
            if (err) {
                return next(err)
            }
            recentPastviews = response.pastViews || []
            recentPastviews = recentPastviews.filter(offer => {
                return offer.timeStamp > recentViewFrame
            }) || []
            
            recentPastviews = recentPastviews.map(offer => {
                return offer.offerId
            })
            console.log(recentPastviews)
            allViews = recentPastviews.concat(currentList)
            console.log(allViews)

            favoritedTags = response.favoritedTags
            favoritedMerchant = response.favoritedMerchant
        }).then(function () {
            return Offer.find({ category: category, endDate: { $gte: date }, startDate: { $lte: date }, location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius / 3963.2] } } }, (err, response) => {
                if (err) {
                    return next(err)
                }
                if (!response) {
                    return;
                }
                offerList = response || []
                offerList = offerList.filter(offer => {
                    return !allViews.includes(offer._id)
                }) || []
                if (offerList.length) {
                    offerList.forEach((offer, index) => {
                        offerList[index].score = score(offer, favoritedTags, favoritedMerchant)
                    })
                    offerList.sort((a, b) => {
                        return b.score - a.score
                    })
                }
            }).then(function () {
                if(!offerList){
                    offerList = []
                }
                if (offerList.length < resAmount) {
                    return MerchantBio.find({ category: category, location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius / 3963.2] } } }, (err, response) => {
                        if (err) {
                            return next(err)
                        }
                        if (!response) {
                            return;
                        }
                        bioList = response
                        bioList = bioList.filter(bio => {
                            return !allViews.includes(bio._id)
                        }) || []
                        bioList.forEach((bio, index) => {
                            bioList[index].score = score(bio, favoritedTags, favoritedMerchant)
                        }) || []
                        bioList.sort((a, b) => {
                            return b.score - a.score
                        })
                        let bioNum = resAmount - offerList.length
                        let listToSend = offerList.concat(bioList.splice(0, bioNum))
                        if (listToSend.length) {
                            res.json({ offerList: listToSend })
                        } else {
                            res.sendStatus(404);
                        }
                    })
                } else {
                    res.json({ offerList: offerList.splice(0, resAmount) })
                    return;
                }

            }).catch(err => {
                return next(err)
            })
        })
    } else {
        res.sendStatus(404)
    }


})

searchRouter.post('/add-view', (req, res, next) => {
    User.updateOne({ _id: req.user.id }, { $push: { pastViews: { offerId: req.body.offerId } } }, err => {
        if (err) {
            next(err)
        }
    })
    Merchant.updateOne({ _id: req.body.merchantId }, { $push: { views: { id: req.body.offerId } } }, err => {
        if (err) {
            return next(err)
        }
    })
    res.send()
})

searchRouter.post('/add-like', (req, res, next) => {
    User.updateOne({ _id: req.user.id }, { $push: { favoritedMerchant: req.body.merchantId } }, err => {
        if (err) {
            return next(err)
        }
    })
    Merchant.updateOne({ _id: req.body.merchantId }, { $push: { favorites: { id: req.body.offerId } } }, err => {
        if (err) {
            return next(err)
        }
    })
    res.send()
})

module.exports = searchRouter;
