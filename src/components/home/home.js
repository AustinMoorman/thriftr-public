import React from 'react';
import './home.css';


import OffersList from '../offersList/offersList';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: null,
      currentLocation: { latitude: null, longitude: null },
      radius: null,
      offerList: [],
      noMoreOffers: false
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onBack = this.onBack.bind(this)
    this.searchParams = this.searchParams.bind(this)
    this.userInfo = this.userInfo.bind(this)
  }

  handleBack() {
    this.setState({ category: null })
  }
  handleClick(event) {
    this.setState({ category: event.target.name })
  }
  onBack() {
    console.log('onback')
    this.setState({ category: null });
  }
  searchParams(currentLocation, radius,reset) {
    let status;
    const endSlide = {
      name: "that's it for now",
      details: "try changing up your search to something different",
      images: [],
      location: {
        coordinates: []
      }

    }
    if(reset){
      this.setState({offerList:[], noMoreOffers:false})
    }
    this.setState({ currentLocation: currentLocation, radius: radius }, () => {
      if (!this.state.noMoreOffers) {
        fetch(`${process.env.REACT_APP_EXPRESS_URL}/api/login/search/get-offers`,
          { method: 'POST', mode: 'cors', credentials: 'include', body: JSON.stringify({ longitude: currentLocation.longitude, latitude: currentLocation.latitude, radius: radius, category: this.state.category }), headers: { 'Content-Type': 'application/json' } })
          .then(res => {
            status = res.status
            if (status == 404) {
              let currentOfferList = this.state.offerList
              currentOfferList.push(endSlide)
              return this.setState({ noMoreOffers: true, offerList: currentOfferList })
            }
            if (status !== 200) {
              return this.setState({ error: 'there was an error',offerList:[endSlide] })
            }
            return res.json()
          })
          .then(data => {
            if (status == 200) {
              let currentOffer = this.state.offerList
              if(data.offerList.length < 5){

                this.setState({ offerList: currentOffer.concat(data.offerList,[endSlide]),noMoreOffers: true })

              }else{
                this.setState({ offerList: currentOffer.concat(data.offerList) })
              }
              
            }
          })
      }
    })
  }
  userInfo() {
    if(this.props.guest){
      return <p className="userInfo">you are currently using a guest account. for a better user experience please logout and create a new account</p>
    }
    else{
      return <p className="userInfo">you are currently signed in under {this.props.email}</p>
    }
  }


  render() {
    if (this.state.category) {
      return (
        <OffersList category={this.state.category} onBack={this.onBack} searchParams={this.searchParams} currentLocation={this.state.currentLocation} radius={this.state.radius} offerList={this.state.offerList} />
      )
    } else {
      return (
        <div id="home">
          <div className="head">
            <h1>thrift<span className="green">r</span></h1>
          </div>
          <div className="homeOptions">
            <div>
              <button name="bar" onClick={this.handleClick}>bar</button>
            </div>
            <div>
              <button name="restaurant" onClick={this.handleClick}>restaurant</button>
            </div>
            <div>
              <button name="entertainment" onClick={this.handleClick}>entertainment</button>
            </div>
            <div>
              <button id="logOut" name="logout" onClick={this.props.logout}>logout or create new account</button>
            </div>
            {this.userInfo()}
          </div>

        </div>
      )
    }

  }
}

export default Home;