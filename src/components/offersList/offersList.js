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
    this.renderOffers = this.renderOffers.bind(this);
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
      console.log(data.offerList)
      this.setState({offerList: data.offerList})
    })
  }

  renderOffers(){
    if(this.state.offerList){
      return <Offers offerList={this.state.offerList}/>
    }
  }

  render() {
    return (
      <div>
        <Refine onBack={this.props.onBack} setLocation={this.props.setLocation} currentLocation={this.props.currentLocation} radius={this.props.radius} searchParams={this.props.searchParams}/>
        {this.renderOffers()}
        <button onClick={this.getOffers}>get offers</button>
      </div>
      
    )
  }
}

export default OffersList;