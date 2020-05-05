import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import './imageSlider.css'


class ImageSlider extends React.Component {
    constructor(props) {
        super(props)
        this.slideCreator = this.slideCreator.bind(this)
    }

    
    slideCreator() {
        return this.props.images.map(img => {
            return <div ><img src={img} style={{height: '200px'}} /></div>
        })
    }

    render() {
        return (
            <SwipeableViews enableMouseEvents>
                {this.slideCreator()}
            </SwipeableViews>
        )
    }
}


export default ImageSlider;