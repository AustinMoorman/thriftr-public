import React from 'react';
import './offersList.css';
import Offers from'./offers/offers';
import Refine from './refine/refine';

class OffersList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      offerList: false,
      hideOffers: true,
    }
    this.hideOffers = this.hideOffers.bind(this);
    this.showOffers = this.showOffers.bind(this);
  }


  hideOffers() {
    this.setState({hideOffers: true})
  }
  showOffers() {
    this.setState({hideOffers: false})
  }


  render() {
    if(!this.props.offerList.length || this.state.hideOffers) {
      return (
        <div id="offerList">
          <Refine refineOpen={this.state.hideOffers} showOffers={this.showOffers} hideOffers={this.hideOffers} onBack={this.props.onBack} setLocation={this.props.setLocation} currentLocation={this.props.currentLocation} radius={this.props.radius} searchParams={this.props.searchParams} getOffers={this.getOffers}/>
        </div>
        
      )

    }else{
      return (
        <div id="offerList">
          <div>
                  <Refine refineOpen={this.state.hideOffers} hideOffers={this.hideOffers} showOffers={this.showOffers} onBack={this.props.onBack} setLocation={this.props.setLocation} currentLocation={this.props.currentLocation} radius={this.props.radius} searchParams={this.props.searchParams} getOffers={this.getOffers}/>
          </div>
          <div className="offersContainer">
            <Offers offerList={this.props.offerList} currentLocation={this.props.currentLocation} radius={this.props.radius} searchParams={this.props.searchParams}/>
          </div>
    </div>
      )

    }


  }
}

export default OffersList;