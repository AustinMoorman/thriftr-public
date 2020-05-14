import React from 'react';
import ImageSlider from '../../imageSlider/imageSlider';
import PictureUpload from '../pictureUpload/pictureUpload';
import AddTags from '../addTags/addTags';
import OfferMap from '../../offersList/offers/offerMap/offerMap'
import './editBio.css'

class EditBio extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selected: false,
            errorMessage: '',
            save: 'save',
            change: false,
            backText: 'back',
            backMessage: '',
            bio: {
                name: '',
                formattedAddress: '',
                bio: '',
                images: [],
                location: {},
                tags: [],
                merchantId: '',
                category: []
            }
        }
        this.getBio = this.getBio.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.onBack = this.onBack.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.getSelected = this.getSelected.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.updateTags = this.updateTags.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.categoryCheck = this.categoryCheck.bind(this);
        this.addressFormatter = this.addressFormatter.bind(this);
    }

    getBio() {
        fetch(`${process.env.REACT_APP_EXPRESS_URL}/api/login/merchant/bio`,
            { method: 'GET', mode: 'cors', credentials: 'include' })
            .then(res => {
                if (res.status != 200) {
                    return this.setState({ errorMessage: 'something unexpected happened', bio: { merchantId: false } })
                }
                return res.json()
            })
            .then(data => {
                this.setState({ bio: data })
            })

    }
    handleClick(event) {
        this.setState({ selected: event.target.name })

    }
    onBack() {
        this.setState({ selected: false, change: true })
    }
    handleSave() {
        if (this.state.save === 'save') {
            fetch(`${process.env.REACT_APP_EXPRESS_URL}/api/login/merchant/update-bio`,
                { method: 'POST', mode: 'cors', body: JSON.stringify({ bio: this.state.bio }), headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
                .then(res => {
                    if (res.status != 200) {
                        return;
                    }
                    this.setState({ save: 'saved', backText: 'back', backMessage: '', change: false })
                })
        }

    }
    handleChange(event) {
        let bio = this.state.bio
        bio.bio = event.target.value
        this.setState({ save: 'save', change: true, bio: bio })
    }

    getSelected(selection) {
        let bio = this.state.bio
        bio.images = selection
        this.setState({ save: 'save', change: true, bio: bio })
    }
    handleBack() {
        if (this.state.change) {
            this.setState({ backText: 'yes', backMessage: 'are you sure you want to go back without saving?', change: false })
        } else {
            this.props.onBack()
        }

    }
    updateTags(stateTags) {
        let bio = this.state.bio;
        bio.tags = stateTags
        this.setState({ save: 'save', change: true, bio: bio })
    }

    addCategory(event) {
        let bio = this.state.bio;
        let category = event.target.name
        let categoryArr = bio.category
        const index = categoryArr.findIndex(cat => cat === category)
        if (index == -1) {
            categoryArr.push(category)
            bio.category = categoryArr
            this.setState({ save: 'save', change: true, bio: bio, [category]: true })
        } else {
            categoryArr.splice(index, 1)
            bio.category = categoryArr
            this.setState({ save: 'save', change: true, bio: bio, [category]: false })
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

    categoryCheck(category) {
        let categoryArr = this.state.bio.category
        const index = categoryArr.findIndex(cat => cat === category)
        if (index == -1) {
            return false
        } else {
            return true
        }
    }
    componentDidMount() {
        
    }

    render() {
        if (this.state.bio.merchantId) {
            switch (this.state.selected) {
                case false:
                    return (
                        <div id="editBio">
                            <div className="head">
                                <h1>thrift<span className="green">r</span></h1>
                            </div>
                            <div className="bioImages">
                                <ImageSlider className="imageSlider" images={this.state.bio.images} />
                            </div>

                            <div className="bioBottom">
                                <div className="bioInfo">
                                    <div className="bioMid">
                                        <div className="bioLeft">
                                            <button name="changeImg" onClick={this.handleClick}>add pictures</button>
                                            <h1 className="bioTitle">{this.state.bio.name}</h1>
                                        </div>
                                        <div className="bioRight">
                                            <p>{this.addressFormatter(this.state.bio.formattedAddress)}</p>
                                        </div>
                                    </div>
                                    <div className="bioDetails">
                                        <textarea name="bio" value={this.state.bio.bio} onChange={this.handleChange} autoCapitalize="sentences" placeholder="add bio"></textarea>
                                    </div>
                                    <div className="tags">
                                        <h2>tags</h2>
                                        <AddTags updateTags={this.updateTags} currentSelection={this.state.bio.tags} />

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
                                    <div className="backNSave">
                                        <button onClick={this.handleSave}>{this.state.save}</button>
                                        <p>{this.state.backMessage}</p>
                                        <button onClick={this.handleBack}>{this.state.backText}</button>
                                    </div>

                                </div>
                            </div>
                        </div >





                    )
                case 'changeImg':
                    return (
                        <div>
                            <PictureUpload merchantId={this.state.bio.merchantId} currentSelection={this.state.bio.images} onBack={this.onBack} selected={this.getSelected} />
                        </div>
                    )
            }
        } else {
            this.getBio()
            return (
                <div>
                    loading
                </div>
            )
        }
    }
}


export default EditBio;

