import React from 'react';
import './merchantHome.css';
import EditBio from './editBio/editBio';
import CreateOffer from './createOffer/createOffer';
import ViewOffers from './viewOffers/viewOffers';
import Analytics from './analytics/analytics';



class MerchantHome extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: false
        }

        this.handleClick = this.handleClick.bind(this);
        this.onBack = this.onBack.bind(this);
    }

    handleClick(event) {
        this.setState({ selected: event.target.name })

    }
    onBack() {
        this.setState({selected: false})
    }





    render() {
        switch (this.state.selected) {
            case false:
                return (
                    <div>
                        <h1>Merchant Home</h1>
                        <button onClick={this.handleClick} name="edit bio">edit bio</button>
                        <button onClick={this.handleClick} name="create offer">create offer</button>
                        <button onClick={this.handleClick} name="current offers">current offers</button>
                        <button onClick={this.handleClick} name="past offers">past offers</button>
                        <button onClick={this.handleClick} name="analytics">analytics</button>
                    </div>
                )
            case 'edit bio':
                return (
                    <div>
                        <EditBio onBack={this.onBack} />
                    </div>
                )
            case 'create offer':
                return (
                    <div>
                        <CreateOffer onBack={this.onBack}/>
                    </div>
                )
            case 'current offers':
                return (
                    <div>
                        current offers
                    </div>
                )
            case 'past offers':
                return (
                    <div>
                        past offers
                    </div>
                )

            case 'analytics':
                return (
                    <div>
                        analytics
                    </div>
                )

        }
    }

}

export default MerchantHome;