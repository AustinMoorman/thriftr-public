import React from 'react';
import './refine.css';
import RefineMap from './refineMap'
import { ReactComponent as Up } from './icon_up.svg'
import { ReactComponent as Filter } from './icon_filter.svg'
import { ReactComponent as Back } from './icon_back.svg'

class Refine extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      full: true,
      message: null,
      currentCord: { latitude: 39.8283, longitude: -98.5795 },
      zipcode: null,
      zipcodeVal: '',
      zoom: 4,
      radius: 10
    }

    this.openRefine = this.openRefine.bind(this)
    this.findLocation = this.findLocation.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.fetchCord = this.fetchCord.bind(this)
    this.collapse = this.collapse.bind(this)
  }

  openRefine() {
    this.props.hideOffers()
  }
  findLocation() {
    if (!navigator.geolocation) {
      return this.setState({ message: 'your browser does not support GeoLocation, please enter your zipcode' })
    } else {
      var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      navigator.geolocation.getCurrentPosition(pos => {
        const currentLocation = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }

        fetch('http://localhost:3005/api/login/search/Add-Location',
          { method: 'POST', body: JSON.stringify(currentLocation), mode: 'cors', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
          .then(res => {
            if (res.status != 200) {
              return this.setState({ message: 'there was an error with Geolocation, please enter your zip' })
            } else {
              this.setState({ currentCord: currentLocation, zoom: 10 })
              return true
            }
          })
      }, err => {
        return this.setState({ message: 'there was an error with Geolocation, please enter your zip' })
      }, options);
    }

  }
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  fetchCord() {
    if (this.state.zipcode) {
      if (this.state.zipcode.length == !5) {
        return this.setState({ zipcodeVal: " please enter a 5 digit zipzode" })
      }
      let status;
      fetch('http://localhost:3005/api/login/search/Add-Location-By-Zipcode',
        { method: 'POST', body: JSON.stringify({ zipcode: this.state.zipcode }), mode: 'cors', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
        .then(res => {
          if (res.status != 200) {
            return this.setState({ zipcodeVal: 'their was an error we can not find your location' })
          } else {
            status = 200;
            return res.json()
          }
        })
        .then(data => {
          if (status == 200) {
            return this.setState({ currentCord: { latitude: data.body.latitude, longitude: data.body.longitude }, zoom: 10 })
          }
        })
    }

  }
  collapse() {
    console.log('collapse')
    if (this.state.currentCord.latitude !== 39.8283 && this.state.currentCord.longitude !== -98.5795 ) {
      this.props.searchParams(this.state.currentCord, this.state.radius);
    }
    this.props.showOffers()
  }
  componentDidMount() {
    if(this.props.currentLocation.latitude && this.props.currentLocation.longitude){
       this.setState({ currentCord: this.props.currentLocation, zoom: 10, radius: this.props.radius })
    }
  }

  render() {
    if (this.props.refineOpen) {
      return (
        <div id="refineExtended" className="refine">
          <div class="notMap">
            <div className="refineHead">
              <div></div>
              <h1>thrift<span className="green">r</span></h1>
              <button name='collapse' onClick={this.collapse}><Up className="upIcon" /></button>
            </div>
            <div className="searchParams">
              <div className="findLocation">
                <button name="findLocation" onClick={this.findLocation}>find my location</button>
                <p>or </p>
                <div className="zipcode">
                  <input type="text" name="zipcode" onChange={this.handleChange} maxLength="5" placeholder="zipcode"></input>
                  <button class="zipcodeGo" name="zipcodeFind" onClick={this.fetchCord} disabled={!this.state.zipcode}>go</button>
                </div>
              </div>

              <div className="radius">
                <input className="slider" type="range" value={this.state.radius} min=".5" max="25" name="radius" step=".5" onChange={this.handleChange}></input>
                <p className="radiusInput" >{this.state.radius}</p>
              </div>

            </div>
          </div>

          <div className="map">
            <RefineMap currentCord={this.state.currentCord} zoom={this.state.zoom} radius={this.state.radius} />
          </div>
        </div>
      )
    } else {
      return (
        <div className="refineHead" >
          <button name="back" onClick={this.props.onBack}><Back className="backIcon" /></button>
          <h1>thrift<span className="green">r</span></h1>
          <button name="refine" onClick={this.openRefine}><Filter className="filterIcon" /></button>
        </div>
      )

    }
  }
}

export default Refine;