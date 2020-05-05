const mongoose = require('mongoose');

const merchantSchema = mongoose.Schema({
    name: String,
    googleId: String,
    email: String,
    password: String,
    formattedAddress: String,
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
    bioViews: [String],
    images: [String]
})

module.exports = mongoose.model('Merchant',merchantSchema);



