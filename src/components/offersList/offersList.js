import React from 'react';
import './offersList.css';
import Offers from'./offers/offers';
import Refine from './refine/refine';

class OffersList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      offerList: false,
      hideOffers: true
    }
    this.getOffers = this.getOffers.bind(this);
    this.hideOffers = this.hideOffers.bind(this);
    this.showOffers = this.showOffers.bind(this);
  }

  getOffers() {
    if(this.props.currentLocation.longitude && this.props.currentLocation.latitude && this.props.radius){
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

  }
  hideOffers() {
    this.setState({hideOffers: true})
  }
  showOffers() {
    this.setState({hideOffers: false})
  }


  render() {
    if(!this.props.offerList || this.state.hideOffers) {
      return (
        <div id="offerList">
          <Refine showOffers={this.showOffers} hideOffers={this.hideOffers} onBack={this.props.onBack} setLocation={this.props.setLocation} currentLocation={this.props.currentLocation} radius={this.props.radius} searchParams={this.props.searchParams} getOffers={this.getOffers}/>
        </div>
        
      )

    }else{
      return (
        <div id="offerList">
          <div>
                  <Refine hideOffers={this.hideOffers} showOffers={this.showOffers} onBack={this.props.onBack} setLocation={this.props.setLocation} currentLocation={this.props.currentLocation} radius={this.props.radius} searchParams={this.props.searchParams} getOffers={this.getOffers}/>
          </div>
          <div className="offersContainer">
            <Offers offerList={this.props.offerList} currentLocation={this.props.currentLocation} radius={this.props.radius} />
          </div>
    </div>
      )

    }


  }
}

export default OffersList;