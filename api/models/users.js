const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    currentLocation: {longitude: String, latitude: String},
    currentLocationOk: {type: Boolean, default: false},
    pastViews: [{offerId: {type: String}, timeStamp: {type: Number, default: Date.now}}],
    favoritedTags:[{tag: {type: String}, occurance: {type: Number, default: 1}}],
    favoritedMerchant:[String],
    logins: [String],
    guest: {type: Boolean, default: false}
})

module.exports = mongoose.model('User',userSchema);
