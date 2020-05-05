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
                    strokeColor= '#FF0000'
                    strokeOpacity= {0.8}
                    strokeWeight= {2}
                    fillColor= '#FF0000'
                    fillOpacity= {0.35}
                    />
                )
            }
        }
            
        

    render() {
        this.mapMarker()
        return (
            <Map google={this.props.google} zoom={this.props.zoom}
            initialCenter={{lat: this.props.currentCord.latitude, lng: this.props.currentCord.longitude}} 
            center={{lat: this.props.currentCord.latitude, lng: this.props.currentCord.longitude}}
            style={{width: 500, height: 500, position: 'relative'}}>
                {this.mapMarker()}
                {this.addCircle()}
            </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAvSwkP5aKgqIhubRUdI_2xYixBoshD9j0'
})(RefineMap)