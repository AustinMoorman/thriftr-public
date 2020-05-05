import React from 'react';
import './offers.css';
import ImageSlider from '../../imageSlider/imageSlider'
import SlideableViews from 'react-swipeable-views'


class Offers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentIndex: 0,
      lastLoaded: 0,
      roll: []
    }
    this.offerCreator = this.offerCreator.bind(this)
    this.changeIndex = this.changeIndex.bind(this)
    this.seed = this.seed.bind(this)
  }
  offerCreator(index) {
    const offer = this.props.offerList[index]
    if(offer){
          const newOffer = (
      <div>
        <ImageSlider images={offer.images} />
        <h1>{offer.name}</h1>
        <h2>{offer.deal}</h2>
        <p>mapping element</p>
        <p>uber element</p>
        <p>{function () {
          const timeLeft = offer.endDate - Date.now() / 60000
          if (timeLeft < 60) {
            return `ending in ${timeLeft} minutes`
          }
        }}</p>
        <p>{offer.details || offer.bio}</p>
      </div>
    )
    let roll = this.state.roll
    roll.push(newOffer)
    this.setState({ roll: roll, lastLoaded: index })
    }
  }

  changeIndex(index) {
    console.log(index)
    const oldIndex = this.state.currentIndex
    this.setState({ currentIndex: index }, () => {
      if (index < oldIndex) {
        this.setState({ currentIndex: oldIndex })
      }
      if (this.state.currentIndex > this.state.lastLoaded - 2 && this.props.offerList[this.state.lastLoaded + 1]) {
        this.offerCreator(this.state.lastLoaded + 1)
      }
    })
    if(index > oldIndex){
          fetch('http://localhost:3005/api/login/search/add-view',
      { method: 'POST', body: JSON.stringify({offerId: this.props.offerList[oldIndex]._id, merchantId: this.props.offerList[oldIndex].merchantId}), mode: 'cors', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
    }

  }
  seed() {
    this.setState({roll: []}, () => {
      this.offerCreator(0)
      this.offerCreator(1)
      this.offerCreator(2)
    })
  }
  componentDidMount() {
    this.seed()
  }


  render() {
    return (
      <div>
        <SlideableViews enableMouseEvents onChangeIndex={this.changeIndex} index={this.state.currentIndex}>
          {this.state.roll}
        </SlideableViews>

      </div>

    )
  }
}

export default Offers;