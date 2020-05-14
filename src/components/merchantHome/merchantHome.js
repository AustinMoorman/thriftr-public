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
                            <div>
                                <button onClick={this.handleClick} name="view offers">view offers</button>
                            </div>
                            <div>
                                <button id="logOut" name="logout" onClick={this.props.logout}>logout or create new account</button>
                            </div>
                            <p className="userInfo">you are currently signed in under {this.props.email}</p>
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
                        <CreateOffer onBack={this.onBack} editOffer={false} />
                    </div>
                )
            case 'view offers':
                return (
                    <div className="fullHeight">
                        <ViewOffers onBack={this.onBack} />
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