import React from 'react';
import ImageSlider from '../../imageSlider/imageSlider';
const firebase = require('firebase');

class PictureUpload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedFile: null,
            downloadProgress: 0,
            allImages: [],
            selectedImages: [],
            imageLimit: ''
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
                        fetch('http://localhost:3005/api/login/merchant/add-image',
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
        fetch('http://localhost:3005/api/login/merchant/all-images',
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
        const img = this.state.allImages.reverse()
        return img.map(element => {
            let style = { width: '200px', height: '200px' }
            if (this.state.selectedImages.find(img => img == element)) {
                style = { width: '200px', height: '200px', borderStyle: 'solid' }
            }
            return <img style={style} src={element} name={element} onClick={this.imgClick}></img>
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
    displaySelecetedImages() {
        const img = this.state.selectedImages
        return img.map(element => {
            return <img style={{ width: '200px', height: '200px' }} src={element} name={element}></img>
        })

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
            <div>
                <div>
                    <button onClick={this.onBack} >back</button>
                    <p>{this.state.noSelectedImage}</p>
                </div>
                <div>
                    <h2>bio photos</h2>
                    <p>{this.state.noBioImage}</p>
                    <ImageSlider images={this.state.selectedImages} />
                </div>

                <div>
                    <h2> all photos</h2>
                    <p>{this.state.imageLimit}</p>
                    {this.imageDisplay()}
                </div>

                <div>
                    <h2>upload new photo</h2>
                    <progress value={this.state.downloadProgress} max="1"></progress>
                    <input type="file" onChange={this.fileSelectedHandler} />
                    <button onClick={this.fileUploadHandler} >Upload files</button>
                </div>
            </div>
        )
    }
}


export default PictureUpload;