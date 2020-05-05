const mongoose = require('mongoose');

const merchantBioSchema = mongoose.Schema({
    name: String,
    formattedAddress: String,
    bio: String,
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
    merchantId: String,
    category: [String]
})

module.exports = mongoose.model('MerchantBio',merchantBioSchema);

