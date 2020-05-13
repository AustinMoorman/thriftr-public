import React from 'react';
import './merchantHome.css';
import EditBio from './editBio/editBio';
import CreateOffer from './createOffer/createOffer';
import ViewOffers from './viewOffers/viewOffers';
import Analytics from './analytics/analytics';
import { ReactComponent as Logout } from '../icon_logout.svg'



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
        this.setState({ selected: false })
    }





    render() {
        switch (this.state.selected) {
            case false:
                return (
                    <div id="home">
                        <div className="logout">
                            <button name="logoutButton" onClick={this.props.logout}><Logout className="logoutIcon" /></button>
                        </div>
                        <div className="head">
                            <h1>thrift<span className="green">r</span></h1>
                        </div>
                        <div className="homeOptions">
                            <div>
                                <button onClick={this.handleClick} name="edit bio">edit bio</button>
                            </div>
                            <div>
                                <button onClick={this.handleClick} name="create offer">create offer</button>
                            </div>
                            ▼ ▼ ▼ under contruction ▼ ▼ ▼
                            <div>
                                <button onClick={this.handleClick} name="current offers">current offers</button>
                            </div>
                            <div>
                                <button onClick={this.handleClick} name="past offers">past offers</button>
                            </div>
                            <div>  
                                <button onClick={this.handleClick} name="analytics">analytics</button>
                            </div>
                        </div>

                    </div>
                )
            case 'edit bio':
                return (
                    <div className="fullHeight">
                        <EditBio onBack={this.onBack} />
                    </div>
                )
            case 'create offer':
                return (
                    <div className="fullHeight">
                        <CreateOffer onBack={this.onBack} />
                    </div>
                )
            case 'current offers':
                return (
                    <div className="fullHeight">
                        current offers
                    </div>
                )
            case 'past offers':
                return (
                    <div className="fullHeight">
                        past offers
                    </div>
                )

            case 'analytics':
                return (
                    <div className="fullHeight">
                        analytics
                    </div>
                )

        }
    }

}

export default MerchantHome;