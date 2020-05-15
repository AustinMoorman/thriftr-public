const express = require('express');
const merchantRouter = express.Router();
const MerchantBio = require('../models/merchantBio');
const Merchant = require('../models/merchant');
const Offer = require('../models/offer');


merchantRouter.get('/bio', async (req, res, next) => {
    let bio;
    await MerchantBio.findOne({ merchantId: req.user.id }, (err, merchantBio) => {
        if (err) {
            return next(err)
        }
        bio = merchantBio
    })
    if (bio) {
        res.status(200).json(bio)
    } else {
        res.status(204).send()
    }
})

merchantRouter.post('/add-image', (req, res, next) => {
    Merchant.updateOne({ _id: req.user.id }, { $push: { images: req.body.url } }, (err, response) => {
        if (err) {
            return res.status(400).send()
        } else {
            res.status(200).send()
        }
    })
})

merchantRouter.get('/all-images', (req, res, next) => {
    Merchant.findOne({ _id: req.user.id }, (err, merchant) => {
        if (err) {
            return next(err)
        }
        res.status(200).json({ images: merchant.images })
    })
})

merchantRouter.post('/update-bio', (req, res, next) => {
    const modification = req.body.bio
    if (modification.merchantId === req.user.id) {
        MerchantBio.updateOne({ merchantId: req.user.id },
            { images: modification.images, bio: modification.bio, tags: modification.tags, category: modification.category },
            (err, response) => {
                if (err) {
                    res.status(400).send()
                } else {
                    res.status(200).send()
                }
            })
    }
})

merchantRouter.get('/start-offer', (req, res, next) => {
    MerchantBio.findOne({ merchantId: req.user.id }, (err, merchant) => {
        if (err) {
            return next(err)
        }
        res.status(200).json({
            name: merchant.name,
            formattedAddress: merchant.formattedAddress,
            location: merchant.location,
            tags: merchant.tags,
            merchantId: merchant.merchantId,
            category: merchant.category
        })
    })
})

merchantRouter.post('/add-offer', (req, res, next) => {
    let offer = req.body.offer;
    if (offer._id) {
        Offer.updateOne({ _id: offer._id }, {
            details: offer.details,
            deal: offer.deal,
            images: offer.images,
            tags: offer.tags,
            category: offer.category,
            startDate: offer.startDate,
            endDate: offer.endDate
        }, (err, response) => {
            if (err) {
                return next(err)
            }
            res.status(200).send()
        })
    } else {
        Offer({
            name: offer.name,
            formattedAddress: offer.formattedAddress,
            details: offer.details,
            deal: offer.deal,
            images: offer.images,
            location: offer.location,
            tags: offer.tags,
            category: offer.category,
            merchantId: req.user.id,
            startDate: offer.startDate,
            endDate: offer.endDate
        }).save((err, response) => {
            if (err) {
                return next(err)
            }
            res.status(200).send()
        })
    }

})


merchantRouter.delete('/delete-image', (req, res, next) => {
    const deleteImg = req.body.img.toString()
    console.log(deleteImg)
    Merchant.updateOne({ _id: req.user.id }, { $pull: { images: deleteImg } }, (err) => {
        if (err) {
            next(err)
        } else {
            res.sendStatus(200)
        }
    })
})

merchantRouter.get('/offers', (req, res, next) => {
    let offerList;
    Offer.find({ merchantId: req.user.id, active: true}, (err, response) => {
        if (err) {
            return next(err)
        }
        offerList = response || []
        res.status(200).json({ offerList: offerList })
    })
})

merchantRouter.delete('/offer', (req, res, next) => {
    Offer.updateOne({ _id: req.body.offerId }, {active:false},(err,response) => {
        if(err){
            return next(err)
        }
        res.sendStatus(200)
    })
})

module.exports = merchantRouter;
