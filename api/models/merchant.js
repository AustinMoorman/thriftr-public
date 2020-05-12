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
    views: [{id:{type: String}, timeStamp:{type: Number, default: Date.now}}],
    favorites: [{id:{type: String}, timeStamp:{type: Number, default: Date.now}}],
    images: [String],
    logins: [String]
})

module.exports = mongoose.model('Merchant',merchantSchema);



