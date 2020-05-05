import React from 'react';
import './home.css';

import OffersList from '../offersList/offersList';

class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      category: null,
      currentLocation: null,
      radius: null
    }
    this.handleBack = this.handleBack.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.onBack = this.onBack.bind(this)
    this.searchParams = this.searchParams.bind(this)
  }

  handleBack() {
    this.setState({category: null})
  }
  handleClick(event) {
    this.setState({category: event.target.name})  
  }
  onBack() {
    console.log('onback')
    this.setState({category: null});
  }
  searchParams(currentLocation,radius) {
    this.setState({currentLocation: currentLocation, radius:radius})
  }


  render() {
    if(this.state.category){
      return (
        <OffersList category={this.state.category} onBack={this.onBack} searchParams={this.searchParams} currentLocation ={this.state.currentLocation} radius={this.state.radius} />
      )
    }else{
      return (
      <div>
        <h1>thriftr Home</h1> 
        <button name="bar" onClick={this.handleClick}>bar</button>
        <button name="restaurant" onClick={this.handleClick}>restaurant</button>
        <button name="entertainment" onClick={this.handleClick}>entertainment</button>
      </div>
    )
    }
    
  }
}

export default Home;