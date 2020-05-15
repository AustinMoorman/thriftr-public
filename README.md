#Thriftr
*"Solving the... Where do you want to eat? Well I don't know?"*

---

##Project's Aim

###User Side
Create a fun and easy to use web app to help people find their next bar, the perfect resturant, or some fun weekend entertainment.


###Merchant Side
Have a quick way to gain new business with easy to use interface that anyone from that night's bartender to the marketing team can use

---

##Technologies
- Node- package manager
- React - Frontend
- Express - Backend
- Mongoose/MongoDB - Database
- MongoDB Atlas - Database Storage
- Firebase Storage - media storage
- Heroku - Hosting

---

##Scope of Functionality

###User
- Create new account or use guest account
- Both actual user accounts and guest accounts are stored as a cookie to ///login information
- Pick from three different categories bar,resturant or entertainment.
- Filter search by radius and use Geolocation to get current location or enter zipcode.
- Offers are returned to the user in an easy to view/swipeable list.
- Users are able to like/heart offers then offers that closely match that offer will appear more frequently.

###Merchant
- Create new account with the help of Google autofil
- Uses Google place id to avoid duplicate accounts
- Merchants can create a bio that users can view anytime even when no ads are running
- Merchants can create offers that get priority when a user searches in their catagory.
- Both the bio and offers gave tag functionality that the backend uses to learn what user likes and show similar offers. 
- Images are stored in thriftr's database so Merchants can reuse as they please.

---

##Examples

###Backend Offer Scoring Functionality
Function receives the offer to score, array of favoritedTags and favorited Merchants from the user. Then, returns a score for that offer based on how many favorited tags match and if that merchant has ever been favorited by the user.

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

###Client side API New Offers Function

Before fetching more offers from the back end the front compiles the search parameters, takes into account if the search parameters have been changed(*reset = true) so this can be used for the inital search and to grab more offers since the back end only returns 5 at a time.

    searchParams(currentLocation, radius, reset) {
        let status;
        const endSlide = {
        name: "that's it for now",
        details: "try changing your search to something different",
        images: [],
        location: {
            coordinates: []
        }
        }
        if (reset) {
        this.setState({ offerList: [], noMoreOffers: false })
        }
        this.setState({ currentLocation: currentLocation, radius: radius }, () => {
        if (!this.state.noMoreOffers) {
            fetch(`${process.env.REACT_APP_EXPRESS_URL}/api/login/search/get-offers`,
            { method: 'POST', mode: 'cors', credentials: 'include', body: JSON.stringify({ longitude: currentLocation.longitude, latitude: currentLocation.latitude, radius: radius, category: this.state.category, currentList: this.state.offerList }), headers: { 'Content-Type': 'application/json' } })
            .then(res => {
                status = res.status
                if (status == 404) {
                let currentOfferList = this.state.offerList
                currentOfferList.push(endSlide)
                return this.setState({ noMoreOffers: true, offerList: currentOfferList })
                }
                if (status !== 200) {
                return this.setState({ error: 'there was an error', offerList: [endSlide] })
                }
                return res.json()
            })
            .then(data => {
                if (status == 200) {
                let currentOffer = this.state.offerList
                if (data.offerList.length < 5) {
                    this.setState({ offerList: currentOffer.concat(data.offerList, [endSlide]), noMoreOffers: true })
                } else {
                    this.setState({ offerList: currentOffer.concat(data.offerList) })
                }
                }
            })
        }
        })
    }

###Express Router for Verifying Merchants

Verify-Id is used to check whether or not a account is in place at that address to avoid dupliate accounts.

    registerMerchantRouter.post('/verify-id', async (req, res, next) => {
        idToCheck = req.body.googleId;
        if (idToCheck) {
            await Merchant.findOne({ googleId: idToCheck }, (err, response) => {
                if (err) {
                    return next(err);
                } else {
                    if (response) {
                        res.status(304).send('location already has an account')
                    } else {
                        res.status(200).send()
                    }
                }
            })
        } else {
            res.status(403).send()
        }
    })

The route below is used to create a new merchant account and it's bio. This verifies the user doesnt already exist using Mongoose and returns the appropreate response.

    registerMerchantRouter.post('/', async (req, res, next) => {
        let newMerchant = req.body;
        await Merchant.findOne({ googleId: newMerchant.place.googleId }, async (err, response) => {
            if (err) {
                return next(err)
            } else {
                if (response) {
                    res.status(304).send('location already taken')
                } else {
                    await Merchant.findOne({ email: newMerchant.email }, async (err, response) => {
                        if (err) {
                            return next(err);
                        } else {
                            if (response) {
                                res.status(304).send('email already taken')
                            } else {
                                const hashedPwd = await bcrypt.hash(newMerchant.password, 10);
                                newMerchant.password = hashedPwd;
                                newMerchant.email = newMerchant.email.toLowerCase();
                                await Merchant({
                                    name: newMerchant.name,
                                    googleId: newMerchant.place.googleId,
                                    email: newMerchant.email,
                                    password: newMerchant.password,
                                    formattedAddress: newMerchant.place.formattedAddress,
                                    location: {type: 'Point', coordinates: [Number(newMerchant.place.longitude),Number(newMerchant.place.latitude)]}
                                }).save(async (err, response) => {
                                    if (err) {
                                        return next(err);
                                    } else {
                                        await MerchantBio({
                                            name: response.name,
                                            merchantId: response.id,
                                            formattedAddress: response.formattedAddress,
                                            location: response.location
                                        }).save((err, response2) => {
                                            if (err) {
                                                return next(err)
                                            } else {
                                                res.status(201).json({ merchant: response });
                                            }
                                        })

                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
    })

###JTW Authentication Middleware

All protected Express paths must go through this authentication middleware. This checks to make sure the user has the correct JWT token to access the following backs. The JWT token is stored as an HTTP only cookie and therefore sent with every resquest to Express.

    const authenticateMiddleware = (req, res, next) => {
        const token = req.cookies.JWT
        if (token === null) {
            return res.status(401).json({ message: 'no token found' })
        }
        jwt.verify(token, process.env.REACT_APP_JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'bad token' });
            }
            req.user = user.data;
            next()
        })
    }