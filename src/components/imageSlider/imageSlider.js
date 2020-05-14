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
            return <img src={img} className="images" style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "cover",
            verticalAlign: "middle"}}/>
        })
    }

    render() {
        if(!this.props.images.length){
            return (
                <div className='noImage'>
                    <h1>no images selected</h1>
                </div>
            )
        }
        if(this.props.map){
                  return (
            <SwipeableViews 
            containerStyle={{
                width: "100vw",
                maxWidth: "720px",
                height: "75vw",
                maxHeight: "540px",
              }}
              enableMouseEvents>
                {this.slideCreator()}
                {this.props.map}
            </SwipeableViews>
        )
        }else{
            return (
                <SwipeableViews 
                containerStyle={{
                    width: "100vw",
                    maxWidth: "720px",
                    height: "75vw",
                    maxHeight: "540px",
                  }}
                  enableMouseEvents>
                    {this.slideCreator()}
                </SwipeableViews>
            )
        }
  
    }
}


export default ImageSlider;