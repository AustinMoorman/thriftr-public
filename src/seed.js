/* 

const User = require('./api/models/users')
const Merchant = require('./api/models/merchant')
const MerchantBio = require('./api/models/MerchantBio')

const remove = (model) => {
    await model.remove({}, err => {
        if(err){
            return console.log(err)
        }
        console.log(`table deleted`)
    })
}

const fill =(model,object) => {
    model(object).save((err,res) => {
        if(err){
            return console.log(err)
        }
        console(res)
    })
}


const userArr = [
    {
        name: 'ausman',
        email: '2@2',
        password: 'Centervill3'
    },
    {
        name: 'austin',
        email: '@gmail',
        password: 'C1234'
    },
    {
        name: 'Jetson',
        email: 'doggo@doggo',
        password: 'woof'
    },
]


const seed = () => {
    remove(User);
    userArr.forEach(element => fill(User,element))
}



await User(newUser).save((err, response) => {
    if(err){
    next(err);
    }else{
    res.status(201).json({user: response});
    }
})

const merchantSchema = mongoose.Schema({
    name: String,
    googleId: String,
    email: String,
    password: String,
    formattedAddress: String,
    coordinates: {longitude: String, latitude: String},
    bioViews:[String]
})

const merchantBioSchema = mongoose.Schema({
    name: merchant.name,
    formattedAddress: String,
    bio: String,
    images: [String],
    coordinates: {longitude: String, latitude: String},
    tags: [String],
    merchantId: [String]
})

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    currentLocation: {longitude: String, latitude: String},
    currentLocationOk: {type: Boolean, default: false} 
}) */