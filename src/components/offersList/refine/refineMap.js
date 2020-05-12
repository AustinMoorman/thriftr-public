import React from 'react';
import {Map, Circle, Marker, GoogleApiWrapper} from 'google-maps-react';

 
class RefineMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.mapMarker = this.mapMarker.bind(this)
        this.addCircle = this.addCircle.bind(this)

    }
        
        
        mapMarker() {
            if(this.props.currentCord.latitude != 39.8283 && this.props.currentCord.longitude != -98.5795){
                return(
                        <Marker position={{lat: this.props.currentCord.latitude, lng: this.props.currentCord.longitude}}/> 
                )
            }
            
        }
        addCircle(){
            if(this.props.currentCord.latitude != 39.8283 && this.props.currentCord.longitude != 98.5795){
                return (
                    <Circle radius={this.props.radius * 1609.344}
                    center={{lat: this.props.currentCord.latitude, lng: this.props.currentCord.longitude}} 
                    strokeColor= '#7dce94'
                    strokeOpacity= {0.8}
                    strokeWeight= {2}
                    fillColor= '#7dce94'
                    fillOpacity= {0.35}
                    />
                )
            }
        }
            
        

    render() {
        this.mapMarker()
        return (
            <Map id="refineMap" google={this.props.google} zoom={this.props.zoom}
            initialCenter={{lat: this.props.currentCord.latitude, lng: this.props.currentCord.longitude}} 
            center={{lat: this.props.currentCord.latitude, lng: this.props.currentCord.longitude}}
            mapTypeControl={false} scaleControl={false} streetViewControl={false} panControl={false} rotateControl={false} 
            style={{height: "60vh", width: "80vw", maxWidth: "720px"}} >
                {this.mapMarker()}
                {this.addCircle()}
            </Map>
    );
  }
}
 
 export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLE_MAPS_APIKEY
})(RefineMap) 

//export default RefineMap;


