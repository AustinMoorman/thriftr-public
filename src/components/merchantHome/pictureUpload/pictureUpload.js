import React from 'react';
import ImageSlider from '../../imageSlider/imageSlider';
import { ReactComponent as Back } from './icon_back.svg'
import './pictureUpload.css';
const firebase = require('firebase');


class PictureUpload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedFile: null,
            downloadProgress: 0,
            allImages: [],
            selectedImages: [],
            imageLimit: '',
        }
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this)
        this.fileUploadHandler = this.fileUploadHandler.bind(this)
        this.getAllimages = this.getAllimages.bind(this);
        this.imgClick = this.imgClick.bind(this);
        this.onBack = this.onBack.bind(this);
    }
    fileSelectedHandler(event) {
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    fileUploadHandler() {
        if (this.state.selectedFile) {
            firebase.auth().signInAnonymously();

            const file = this.state.selectedFile

            const storageRef = firebase.storage().ref(`merchant/${this.props.merchantId}/${file.name}_${Date.now()}`);

            let task = storageRef.put(file);
            let newUrl
            task.on('state_changed',
                function progress(snapshot) {
                    let percentage = snapshot.bytesTransferred / snapshot.totalBytes
                    updateProgress(percentage)
                },
                function error(err) {

                },
                function complete(snapshot) {
                    updateProgress(0)
                    storageRef.getDownloadURL().then((url) => {
                        fetch(`${process.env.REACT_APP_EXPRESS_URL}/api/login/merchant/add-image`,
                            { method: 'POST', mode: 'cors', body: JSON.stringify({ url: url }), headers: { 'Content-Type': 'application/json' }, credentials: 'include' })
                            .then(res => {
                                if (res.status != 200) {
                                    return;
                                }
                            })
                        newUrl = url;
                        addNewImg();

                    })
                })
            const updateProgress = (percentage) => {
                this.setState({ downloadProgress: percentage })
            }
            const addNewImg = () => {
                let allImg = this.state.allImages
                allImg.push(newUrl)
                this.setState({ allImages: allImg })
            }


        }
    }

    getAllimages() {
        let status;
        fetch(`${process.env.REACT_APP_EXPRESS_URL}/api/login/merchant/all-images`,
            { method: 'GET', mode: 'cors', credentials: 'include' })
            .then(res => {
                if (res.status != 200) {
                    return;
                }
                status = res.status
                return res.json()
            })
            .then(data => {
                this.setState({ allImages: data.images })
            })

    }



    imageDisplay() {
        const img = this.state.allImages
        return img.map(element => {
            let imgClass = 'unselected'
            if (this.state.selectedImages.find(img => img == element)) {
                imgClass = 'selectedBelow'
            }
            return <div className="uploaderImageContainer">
                <img className={imgClass} src={element} name={element} onClick={this.imgClick}></img>
            </div>
        })
    }
    selectedImageDisplay() {
        const img = this.state.selectedImages
        return img.map(element => {
            return <div className="uploaderImageContainer">
                <img className='selectedTop' src={element} name={element} onClick={this.imgClick}></img>
            </div>
        })
    }
    imgClick(img) {
        const clickedImg = img.target.src
        let selectedImgs = this.state.selectedImages
        const index = selectedImgs.findIndex(pic => pic === clickedImg)
        if (index == -1) {
            if (selectedImgs.length < 8) {
                selectedImgs.push(clickedImg)
            } else {
                this.setState({ imageLimit: 'you can only have 8 photos' })
            }
        } else {
            selectedImgs.splice(index, 1)
        }
        this.setState({ selectedImages: selectedImgs, noSelectedImage: '' })
    }

    onBack() {
        const images = this.state.selectedImages
        if (images.length == 0) {
            this.setState({ noSelectedImage: 'you must have at least one image selected' })
        } else {
            this.props.selected(this.state.selectedImages)
            this.props.onBack();
        }

    }




    componentDidMount() {
        this.setState({ selectedImages: this.props.currentSelection })
        firebase.auth().signInAnonymously();
        this.getAllimages()
    }

    render() {
        return (
            <div id="pictureUploader">
                <div className="head" >
                    <button name="back" onClick={this.onBack}><Back className="backIcon" /></button>
                    <h1>thrift<span className="green">r</span></h1>
                </div>
                <h2>selected photos</h2>
                <p className="val">{this.state.noSelectedImage}</p>
                <div className="uploaderImagegrid">
                    {this.selectedImageDisplay()}
                </div>
                <h2> all photos</h2>
                <p>{this.state.imageLimit}</p>
                <div className="uploaderImagegridBottom">
                    {this.imageDisplay()}
                </div>

                <div>
                    <h2>upload new photo</h2>
                    <progress value={this.state.downloadProgress} max="1"></progress>
                    <input type="file" className="fileSelecter" onChange={this.fileSelectedHandler} />
                    <button onClick={this.fileUploadHandler} >upload image</button>
                </div>
            </div>
        )
    }
}


export default PictureUpload;