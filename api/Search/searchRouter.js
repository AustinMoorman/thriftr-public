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
        User.findOne({ _id: req.user.id }, (err, response) => {
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
        }).then(function () {
            Offer.find({ category: category, endDate: { $gte: date }, startDate: { $lte: date }, location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius / 3963.2] } } }, (err, response) => {
                if (err) {
                    return next(err)
                }
                if (!response) {
                    return;
                }
                offerList = response
                offerList = offerList.filter(offer => {
                    return !recentPastviews.includes(offer._id)
                })
                offerList.forEach((offer, index) => {
                    offerList[index].score = score(offer, favoritedTags, favoritedMerchant)
                })
                offerList.sort((a, b) => {
                    return b.score - a.score
                })
            }).then(function () {
                MerchantBio.find({ category: category, location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius / 3963.2] } } }, (err, response) => {
                    if (err) {
                        return next(err)
                    }
                    if (!response) {
                        return;
                    }
                    bioList = response
                    bioList = bioList.filter(bio => {
                        return !recentPastviews.includes(bio._id)
                    })
                    bioList.forEach((bio, index) => {
                        bioList[index].score = score(bio, favoritedTags, favoritedMerchant)
                    })
                    bioList.sort((a, b) => {
                        return b.score - a.score
                    })
                    res.json({offerList: offerList.concat(bioList)})
                })
            })
        })
    }

    const score = (off, favTags, favMerchant) => {
        const tags = off.tags

        let total = favTags.map(userTag => {
            let val = 0;
            tags.forEach(offerTag => {
                if (userTag.tag == offerTag) {
                    val = userTag.occurance
                }
            })
            return val
        }) || [0]
        total = total.reduce((accumulator, currentValue) => accumulator + currentValue)
        if (favMerchant.includes(off.merchantId)) {
            total = total * 1.5
        }
        return total
    }
})

searchRouter.post('/add-view', (req,res,next) => {
    User.updateOne({_id: req.user.id },{$push: {pastViews: {offerId: req.body.offerId}}}, err => {
        if(err){
            next(err)
        }
    })
    Merchant.updateOne({_id: req.body.merchantId},{$push: {views: {id: req.body.offerId}}}, err => {
        if(err){
            next(err)
        }
    })
    res.send()
})

module.exports = searchRouter;
