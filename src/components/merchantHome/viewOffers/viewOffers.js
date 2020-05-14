import React from 'react';
import './viewOffers.css'
import ImageSlider from '../../imageSlider/imageSlider'
import OfferMap from '../../offersList/offers/offerMap/offerMap'
import SlideableViews from 'react-swipeable-views'
import CreateOffer from '../createOffer/createOffer'


class ViewOffers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            offerList: [],
            currentIndex: 0,
            offerToEdit: {},
            edit: false,
        }
        this.getOffers = this.getOffers.bind(this);
        this.searchParams = this.searchParams.bind(this);
        this.addressFormatter = this.addressFormatter.bind(this)
        this.offerCreator = this.offerCreator.bind(this);
        this.getTimeLeft = this.getTimeLeft.bind(this);
        this.openEdit = this.openEdit.bind(this);
        this.changeIndex = this.changeIndex.bind(this);
    }
    changeIndex(index) {
        this.setState({currentIndex: index})
      }

    getOffers() {
        fetch(`${process.env.REACT_APP_EXPRESS_URL}/api/login/merchant/offers`,
            { method: 'GET', mode: 'cors', credentials: 'include' })
            .then(res => {
                if (res.status != 200) {
                    return this.setState({ errorMessage: 'something unexpected happened', bio: { merchantId: false } })
                }
                return res.json()
            })
            .then(data => {
                if (data) {
                    setOfferList(data.offerList)
                }
            })

        const setOfferList = (list) => {
            this.setState({ offerList: list })
        }
    }
    searchParams() {
        return null;
    }
    componentDidMount() {
        this.getOffers();
    }
    addressFormatter(address) {
        if (address) {
            let addressArr = address.split(',')
            addressArr.pop()
            return addressArr.map(line => {
                return <p>{line}</p>
            })
        }
    }
    getTimeLeft(endDate, startDate) {
        const timeLeft = Math.round(endDate / 60000 - Date.now() / 60000)
        if (timeLeft < 52560000) {
            return (
                <div>
                    <p>start time: {new Date(startDate).toLocaleDateString()} at {new Date(startDate).toLocaleTimeString()}</p>
                    <p>end time: {new Date(endDate).toLocaleDateString()} at {new Date(endDate).toLocaleTimeString()}</p>
                </div>
            )
        } else {
            return (
                <div>
                    <p>start time: {new Date(startDate).toLocaleDateString()} at {new Date(startDate).toLocaleTimeString()}</p>
                </div>
            )
        }

    }
    offerCreator() {
        return this.state.offerList.map(offer => {
            return (
                <div>
                    <ImageSlider className="imageSlider" images={offer.images} map={<OfferMap className="offerMap" currentLocation={this.props.currentLocation} offerLocation={offer.location} />} />

                    <div className="offerBottom">
                        <div className="offerInfo">
                            <div className="offerMid">
                                <div className="offerLeft">
                                    <h1 className="offerTitle">{offer.name}</h1>
                                    <h2>{offer.deal}</h2>
                                </div>

                                <div className="offerRight">
                                    <p>{this.addressFormatter(offer.formattedAddress)}</p>
                                    <p>{this.getTimeLeft(offer.endDate, offer.startDate)}</p>
                                </div>
                            </div>
                            <p className="offerDetails">{offer.details || offer.bio}</p>
                        </div>
                    </div>
                </div>
            )
        })
    }
    openEdit() {
        this.setState({offerToEdit: this.state.offerList[this.state.currentIndex], edit: true})
    }

    render() {
        if(this.state.edit){
            return (
                <div>
                    <CreateOffer editOffer={true} onBack={this.props.onBack} offer={this.state.offerToEdit}/>
                </div>
            )
        }
        return (
            <div id="viewOffers">
                <div className="notButtons">
                    <SlideableViews enableMouseEvents onChangeIndex={this.changeIndex} index={this.state.currentIndex} containerStyle={{
                        width: "100vw",
                        maxWidth: "720px",
                        height: "100%"
                    }}>
                        {this.offerCreator()}
                    </SlideableViews>
                </div>

                <div className="offerButtons">
                    <button onClick={this.openEdit}>edit offer</button>
                </div>
            </div>
        )
    }
}


export default ViewOffers;