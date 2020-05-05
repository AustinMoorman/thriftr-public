import React from 'react';
import './refine.css';
import RefineMap from './refineMap1'

class Refine extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      full: true,
      message: null,
      currentCord: {latitude: 39.8283, longitude: -98.5795},
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
    this.setState({ full: true })
  }
  findLocation() {
    if (!navigator.geolocation) {
      return this.setState({ message: 'your browser does not support GeoLocation, please enter your zipode' })
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
    this.setState({[event.target.name]: event.target.value })
  }

  fetchCord() {
    if(this.state.zipcode.length ==! 5){
      return this.setState({zipcodeVal: " please enter a 5 digit zipzode"})
    }
    let status;
    fetch('http://localhost:3005/api/login/search/Add-Location-By-Zipcode',
    { method: 'POST', body: JSON.stringify({zipcode:this.state.zipcode}), mode: 'cors', headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
    .then(res => {
      if (res.status != 200){
        return this.setState({zipcodeVal: 'their was an error we can not find your location'})
      }else{
        status = 200;
        return res.json()
      }
    })
    .then(data => {
      if(status == 200){
        return this.setState({currentCord: {latitude: data.body.latitude, longitude: data.body.longitude},zoom: 10})
      }
    })
  }
  collapse() {
    this.props.searchParams(this.state.currentCord,this.state.radius)
    this.setState({full: false})
  }
  componentDidMount(){
    if(this.props.currentLocation && this.props.radius){
      this.setState({full: false})
    }
  }

  render() {
    if (this.state.full) {
      return (
        <div>
          <button name="findLocation" onClick={this.findLocation}>find my location</button>
          <p>or </p>
          <input type="text" name="zipcode" onChange={this.handleChange} maxlength="5" placeholder="use my zipcode"></input>

          <button name="zipcodeFind" onClick={this.fetchCord}>go</button>
          
          <input type="range" value={this.state.radius} min="1" max="20" name="radius" step=".5" onChange={this.handleChange}></input>
          
          <input type="text" name="radius" value={this.state.radius} onChange={this.handleChange}></input>
          <button name='collapse' onClick={this.collapse}>collapse</button>
          <RefineMap currentCord={this.state.currentCord} zoom={this.state.zoom} radius={this.state.radius}/>
        </div>
      )
    }else {
      return (
        <div>
          <button name="back" onClick={this.props.onBack}>back</button>
          <button name="refine" onClick={this.openRefine}>refine</button>
        </div>
      )

    }
  }
}

export default Refine;