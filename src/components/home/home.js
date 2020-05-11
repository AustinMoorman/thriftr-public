import React from 'react';
import './home.css';
import { ReactComponent as Logout } from './icon_logout.svg'

import OffersList from '../offersList/offersList';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      category: null,
      currentLocation: { latitude: null, longitude: null },
      radius: null,
      offerList: false
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onBack = this.onBack.bind(this)
    this.searchParams = this.searchParams.bind(this)
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
  searchParams(currentLocation, radius) {
    this.setState({ currentLocation: currentLocation, radius: radius }, () => {

      fetch(`http://localhost:3005/api/login/search/get-offers?longitude=${currentLocation.longitude}&latitude=${currentLocation.latitude}&radius=${radius}&category=${this.state.category}`,
        { method: 'GET', mode: 'cors', credentials: 'include' })
        .then(res => {
          if (res.status !== 200) {
            this.setState({ error: 'there was an error' })
          }
          return res.json()
        })
        .then(data => {
          console.log(data.offerList)
          this.setState({ offerList: data.offerList })
        })

    })
  }


  render() {
    if (this.state.category) {
      return (
        <OffersList category={this.state.category} onBack={this.onBack} searchParams={this.searchParams} currentLocation={this.state.currentLocation} radius={this.state.radius} offerList={this.state.offerList}/>
      )
    } else {
      return (
        <div id="home">
          <div className="logout">
            <button name="logoutButton" onClick={this.props.logout}><Logout className="logoutIcon" /></button>
          </div>
          <div className="head">
            <h1>thrift<span className="green">r</span></h1>
          </div>
          <div className="homeOptions">
            <button name="bar" onClick={this.handleClick}>bar</button>
            <button name="restaurant" onClick={this.handleClick}>restaurant</button>
            <button name="entertainment" onClick={this.handleClick}>entertainment</button>
            <div></div>
          </div>

        </div>
      )
    }

  }
}

export default Home;