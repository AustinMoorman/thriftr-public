import React from 'react';
import './offersList.css';
import Offers from'./offers/offers';
import Refine from './refine/refine';

class OffersList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      currentLocation: null,
      radius: null,
      offerList: null
    }
    this.getOffers = this.getOffers.bind(this);
  }

  getOffers() {
    fetch(`http://localhost:3005/api/login/search/get-offers?longitude=${this.props.currentLocation.longitude}&latitude=${this.props.currentLocation.latitude}&radius=${this.props.radius}&category=${this.props.category}`,
    { method: 'GET', mode: 'cors', credentials: 'include' })
    .then(res => {
      if(res.status !== 200){
        this.setState({error: 'there was an error'})
      }
      return res.json()
    })
    .then(data => {
      this.setState({offerList: data.offerList})
    })
  }

  render() {
    return (
      <div>
        <Refine onBack={this.props.onBack} setLocation={this.props.setLocation} currentLocation={this.props.currentLocation} radius={this.props.radius} searchParams={this.props.searchParams}/>
        <Offers />
        <button onClick={this.getOffers}>get offers</button>
      </div>
      
    )
  }
}

export default OffersList;