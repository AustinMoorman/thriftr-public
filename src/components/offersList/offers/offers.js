import React from 'react';
import './offers.css';
import ImageSlider from '../../imageSlider/imageSlider'
import SlideableViews from 'react-swipeable-views'
import OfferMap from './offerMap/offerMap'
import { ReactComponent as Next } from './icon_next.svg'
import { ReactComponent as Heart } from './icon_heart.svg'



class Offers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0,
      lastLoaded: 0,
      roll: [],
      liked: [],
      color: "#E0E0E0"
    }
    this.offerCreator = this.offerCreator.bind(this)
    this.changeIndex = this.changeIndex.bind(this)
    this.load = this.load.bind(this)
    this.getTimeLeft = this.getTimeLeft.bind(this)
    this.next = this.next.bind(this)
    this.like = this.like.bind(this)
    this.addressFormatter = this.addressFormatter.bind(this);
  }
  getTimeLeft(endDate) {
    const timeLeft = Math.round(endDate / 60000 - Date.now() / 60000)
    console.log(timeLeft)
    if (timeLeft < 60) {
      return `ending in ${timeLeft} minutes`
    } else {
      return ''
    }

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

  offerCreator() {
    return this.props.offerList.map(offer => {
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
                  <p>{this.getTimeLeft(offer.endDate)}</p>
                </div>
              </div>
              <p className="offerDetails">{offer.details || offer.bio}</p>
            </div>
          </div>
        </div>
      )
    })
  }
  next() {
    this.changeIndex(this.state.currentIndex + 1)
  }
  like() {
    let liked = this.state.liked
    const index = this.state.currentIndex;
    if (!liked.includes(index)) {

      fetch('http://localhost:3005/api/login/search/add-like',
        { method: 'POST', body: JSON.stringify({ offerId: this.props.offerList[index]._id, merchantId: this.props.offerList[index].merchantId }), mode: 'cors', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
      liked.push(index)
      this.setState({ liked: liked, color: '#7dce94' })
    }

  }

  changeIndex(index) {
    const oldColor = this.state.color
    const oldIndex = this.state.currentIndex
    this.setState({ currentIndex: index, color: '#E0E0E0' }, () => {
      if (index < oldIndex) {
        this.setState({ currentIndex: oldIndex, color: oldColor })
      }
    })
    if (index > oldIndex) {
      fetch('http://localhost:3005/api/login/search/add-view',
        { method: 'POST', body: JSON.stringify({ offerId: this.props.offerList[oldIndex]._id, merchantId: this.props.offerList[oldIndex].merchantId }), mode: 'cors', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
    }
  }

  load() {
    if (this.props.offerList[this.state.lastLoaded + 1] && this.state.currentIndex + 3 > this.state.lastLoaded) {
      this.offerCreator(this.state.lastLoaded + 1)
    }
  }
  render() {
    const offer = this.props.offerList[0]
    return (
      <div className="offer">
        <div className="notButtons">
          <SlideableViews enableMouseEvents onChangeIndex={this.changeIndex} onTransitionEnd={this.load} index={this.state.currentIndex} containerStyle={{
          width: "100vw",
          maxWidth: "720px",
          height: "100%"
        }}>
          {this.offerCreator()}
        </SlideableViews>
        </div>
        
        <div className="offerButtons">
          <button onClick={this.like} className="heartButton" style={{ fill: this.state.color,stroke: this.state.color }}><Heart className="heart" /></button>
          <button onClick={this.next}><Next className="offerNext" /></button>
        </div>
      </div>


    )
  }
}

export default Offers;