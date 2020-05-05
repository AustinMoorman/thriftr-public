const express = require('express');
const searchRouter = express.Router()

const mongoose = require('mongoose');
const User = require('../models/users');
const Offer = require('../models/offer');

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
        if (body.status == 'OK') {
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



searchRouter.get('/get-offers', (req, res, next) => {
    const date = Date.now()
    const latitude = Number(req.query.latitude)
    const longitude = Number(req.query.longitude)
    const radius = Number(req.query.radius)
    const category = req.query.category
    let recentPastviews;
    let favoritedTags;
    let favoritedMerchant;
    let offerList;
    let bioList;
    let listToSend;

    /* console.log(latitude)
    console.log(longitude)
    console.log(radius)
    console.log(category)
 */
    if (latitude && longitude && radius && category) {
        User.findOne({ _id: req.user.id }, function(err, response){
            if (err) {
                return next(err)
            }
            recentPastviews = response.pastViews || []
            if (recentPastviews) {
                recentPastviews = recentPastviews.filter(offer => {
                    return offer.timeStamp > (date - (1000 * 60 * 60 * 24))
                })

                recentPastviews = recentPastviews.map(offer => {
                    return offer.offerId
                })
            }
            
            favoritedTags = response.favoritedTags
            favoritedMerchant = response.favoritedMerchant
        })
            .then(function() {
                Offer.find({ category: category, endDate: { $gte: date }, startDate: { $lte: date }, location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius / 3963.2] } } }, (err, response) => {
                    if (err) {
                        return next(err)
                    }
                    if (!response) {
                        return res.sendStatus(404)
                    }
                    offerList = response
                    offerList = offerList.filter(offer => {
                        return !recentPastviews.includes(offer._id)
                    })
                    console.log(offerList)
                })
            }).then(function() {
                console.log(offerList)
                offerList.forEach(offer => {
                    offer.score == score(offer, favoritedTags, favoritedMerchant)
                })
                offerList.sort((a, b) => {
                    return a.score - b.score
                })
            })
        res.sendStatus(200)
    } else {
        res.sendStatus(404)
    }
})

const score = (off, favTags, favMerchant) => {
    const tags = off.tags

    let total = favTags.forEach(map => {
        if (tags == merch.merchant) {
            return merch.occurance
        } else {
            return 0
        }
    })
    total = total.reduce((accumulator, currentValue) => accumulator + currentValue)
    if (favMerchant.includes(offer.merchantId)) {
        total = total * 1.5
    }
    //console.log(total)
    return total
}

module.exports = searchRouter;
