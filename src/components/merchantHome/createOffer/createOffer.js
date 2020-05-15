import React from 'react';
import ImageSlider from '../../imageSlider/imageSlider';
import PictureUpload from '../pictureUpload/pictureUpload';
import AddTags from '../addTags/addTags';
import './createOffer.css'


class CreateOffer extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: false,
            errorMessage: '',
            backText: 'back',
            backMessage: '',
            dateVal: '',
            startDate: '',
            endDate: '',
            publishVal: '',
            offer: {
                name: '',
                formattedAddress: '',
                details: '',
                deal: '',
                images: [],
                location: {},
                tags: [''],
                merchantId: '',
                startDate: '',
                endDate: ''
            }
        }
        this.handleClick = this.handleClick.bind(this);
        this.onBack = this.onBack.bind(this);
        this.handlePublish = this.handlePublish.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.handleTime = this.handleTime.bind(this);
        this.enableDate = this.enableDate.bind(this);
        this.getIt = this.getIt.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.categoryCheck = this.categoryCheck.bind(this);
        this.addressFormatter = this.addressFormatter.bind(this);
    }

    handleClick(event) {
        this.setState({ selected: event.target.name })

    }
    onBack() {
        this.setState({ selected: false })
    }

    handlePublish() {
        if (this.valiDate() && this.state.offer.images && this.state.offer.deal && this.state.offer.details) {
            fetch(`${process.env.REACT_APP_EXPRESS_URL}/api/login/merchant/add-offer`,
                { method: 'POST', mode: 'cors', body: JSON.stringify({ offer: this.state.offer }), headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
                .then(res => {
                    if (res.status != 200) {
                        return this.setState({ publishVal: 'there was an issue publishing your offer' })
                    }
                    this.props.onBack()
                })
        } else {
            this.setState({ publishVal: 'please complete this offer before publishing' })
        }

    }

    handleChange(event) {
        const mode = event.target.name
        let offer = this.state.offer
        offer[mode] = event.target.value
        this.setState({ offer: offer })
    }

    getSelected(selection) {
        let offer = this.state.offer
        offer.images = selection
        this.setState({ offer: offer })
    }
    handleBack() {
        if (this.state.backText == 'back') {
            this.setState({ backText: 'yes', backMessage: 'are you sure you want to go back without publishing?' })
        } else {
            this.props.onBack()
        }

    }
    updateTags(stateTags) {
        let offer = this.state.offer;
        offer.tags = stateTags
        this.setState({ offer: offer })
    }

    handleTime(event) {
        const date = Date.parse(event.target.value)
        let offer = this.state.offer;
        offer[event.target.name] = date
        this.setState({ offer: offer })
    }

    valiDate() {

        const startDate = this.state.offer.startDate || Date.now()
        const now = Date.now()
        const endDate = this.state.offer.endDate || 253402300000000

        if (startDate > endDate) {
            this.setState({ dateVal: "please provide a valid date range" })
            return false
        } else if (endDate < now) {
            this.setState({ dateVal: "your end date can't be in the past" })
            return false
        } else {
            let offer = this.state.offer
            offer.startDate = startDate
            offer.endDate = endDate
            this.setState({ offer: offer })
            return true
        }
    }

    enableDate(event) {
        const mode = event.target.name;
        if (this.state[mode]) {
            let offer = this.state.offer;
            offer[mode] = ''

            this.setState({ [mode]: '', offer: offer })
        } else {
            this.setState({ [mode]: <input name={mode} type="datetime-local" onChange={this.handleTime} ></input> })
        }
    }

    addCategory(event) {
        let offer = this.state.offer;
        let category = event.target.name
        let categoryArr = offer.category
        const index = categoryArr.findIndex(cat => cat === category)
        if (index == -1) {
            categoryArr.push(category)
            offer.category = categoryArr
            this.setState({ offer: offer, [category]: true })
        } else {
            categoryArr.splice(index, 1)
            offer.category = categoryArr
            this.setState({ offer: offer, [category]: false })
        }
    }
    categoryCheck(category) {
        let categoryArr = this.state.offer.category
        const index = categoryArr.findIndex(cat => cat === category)
        if (index == -1) {
            return false
        } else {
            return true
        }

    }
    addressFormatter(address) {
        if (address) {
            let addressArr = address.split(',')
            addressArr.pop()
            return addressArr.map(line => {
                return <p>{line}</p>
            })
        }
    }



    getIt() {
        if (this.props.editOffer == true) {
            this.setState({ offer: this.props.offer })
        } else {
            fetch(`${process.env.REACT_APP_EXPRESS_URL}/api/login/merchant/start-offer`,
                { method: 'GET', mode: 'cors', credentials: 'include' })
                .then(res => {
                    if (res.status != 200) {
                        return;
                    }
                    return res.json()
                })
                .then(data => {
                    this.setState({
                        offer: {
                            name: data.name,
                            formattedAddress: data.formattedAddress,
                            details: '',
                            deal: '',
                            images: [],
                            location: data.location,
                            tags: data.tags,
                            category: data.category,
                            merchantId: data.merchantId,
                            startDate: '',
                            endDate: ''
                        }

                    })
                })
        }


    }

    render() {
        if (this.state.offer.merchantId) {
            switch (this.state.selected) {
                case false:
                    return (
                        <div id="createOffer">
                            <div className="head">
                                <h1>thrift<span className="green">r</span></h1>
                            </div>
                            <div className="offerImages">
                                <ImageSlider className="imageSlider" images={this.state.offer.images} />
                            </div>

                            <div className="offerBottom">
                                <div className="offerInfo">
                                    <div className="offerMid">
                                        <div className="offerLeft">
                                            <h1 className="offerTitle">{this.state.offer.name}</h1>
                                            <div className="offerDeal">
                                                <textarea placeholder="deal" name="deal" value={this.state.offer.deal} onChange={this.handleChange} autoCapitalize="sentences" ></textarea>
                                            </div>
                                        </div>
                                        <div className="offerRight">
                                            <button name="changeImg" onClick={this.handleClick}>add pictures</button>
                                            <p>{this.addressFormatter(this.state.offer.formattedAddress)}</p>
                                        </div>
                                    </div>
                                    <div className="offerDetails">
                                        <textarea name="details" value={this.state.offer.details} onChange={this.handleChange} autoCapitalize="sentences" placeholder="add details"></textarea>
                                    </div>
                                    <div className="tags">
                                        <h2>tags</h2>
                                        <AddTags updateTags={this.updateTags} currentSelection={this.state.offer.tags} />

                                    </div>
                                    <div className="category">
                                        <h2>category</h2>

                                        <label className="checkmarkContainer">bar
                                        <input type="checkbox" name="bar" onClick={this.addCategory} defaultChecked={this.categoryCheck('bar')}></input>
                                            <span className="checkmark"></span>
                                        </label>

                                        <label className="checkmarkContainer">restaurant
                                        <input type="checkbox" name="restaurant" onClick={this.addCategory} defaultChecked={this.categoryCheck('restaurant')}></input>
                                            <span className="checkmark"></span>
                                        </label>

                                        <label className="checkmarkContainer">entertainment
                                        <input type="checkbox" name="entertainment" onClick={this.addCategory} defaultChecked={this.categoryCheck('entertainment')}></input>
                                            <span className="checkmark"></span>
                                        </label>

                                    </div>
                                    <div className="startEnd">
                                        <h2>pick start and end date</h2>
                                        <p>if left unchecked this will start when published and will manually need to be ended</p>
                                        <p className="val">{this.state.dateVal}</p>
                                        <div>
                                            <h3>start time</h3>
                                            <label className="checkmarkContainer">
                                                <input type="checkbox" name="startDate" defaultChecked={this.state.startDate} onChange={this.enableDate}></input>
                                                <span className="checkmark"></span>
                                            </label>
                                            {this.state.startDate}
                                        </div>
                                        <div>
                                            <h3>end time</h3>
                                            <label className="checkmarkContainer">
                                                <input type="checkbox" name="endDate" defaultChecked={this.state.endDate} onChange={this.enableDate}></input>
                                                <span className="checkmark"></span>
                                            </label>
                                            {this.state.endDate}
                                        </div>
                                    </div>
                                    <div className="backNPublish">
                                        <p className="val">{this.state.publishVal}</p>
                                        <button onClick={this.handlePublish}>{`save & publish`}</button>
                                        <p className="val">{this.state.backMessage}</p>
                                        <button onClick={this.handleBack}>{this.state.backText}</button>
                                    </div>

                                </div>
                            </div>
                        </div >
                    )
                case 'changeImg':
                    return (
                        <div>
                            <PictureUpload merchantId={this.state.offer.merchantId} currentSelection={this.state.offer.images} onBack={this.onBack} selected={this.getSelected} />
                        </div>
                    )
            }
        } else {
            this.getIt()
            return (
                <div>
                </div>
            )
        }


    }
}


export default CreateOffer;

