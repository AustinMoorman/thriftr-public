const mongoose = require('mongoose');

const offerSchema = mongoose.Schema({
    name: String,
    formattedAddress: String,
    details: String,
    deal: String,
    images: [String],
    location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    tags: [String],
    category: [String],
    merchantId: String,
    startDate: Number,
    endDate: Number,
    active: {type: Boolean, default: true}
})

module.exports = mongoose.model('Offer',offerSchema);

