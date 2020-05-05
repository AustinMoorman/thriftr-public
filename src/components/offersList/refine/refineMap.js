import React from 'react';
import {GoogleMap, withScriptjs, withGoogleMap} from 'react-google-maps'

/* const Map = (props) => {
    return (
        <GoogleMap defaultZoom={props.zoom} 
        defaultCenter={{lat: props.currentCord.latitude, lng: props.currentCord.longitude}}
        onCenterChanged={{lat: props.currentCord.latitude, lng: props.currentCord.longitude}}
        
        />
    )
    
} */


class RefineMap extends React.Component{
    constructor(props){
        super(props)
        this.Map = this.Map.bind(this)
    }


    Map() {
        return (
            <GoogleMap defaultZoom={this.props.zoom} 
            defaultCenter={{lat: this.props.currentCord.latitude, lng: this.props.currentCord.longitude}}
            onCenterChanged={{lat: this.props.currentCord.latitude, lng: this.props.currentCord.longitude}}
            
            />
        )
        
    }
    render() {
        return (
            withScriptjs(withGoogleMap(
                <div style={{height: '500px', width: '500px'}}>
            <GoogleMap googleMapURL={'https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAvSwkP5aKgqIhubRUdI_2xYixBoshD9j0'}
            loadingElement={<div style={{height: "100%"}} />}
            containerElement={<div style={{height: "100%"}} />}
            mapElement={<div style={{height: "100%"}} />}
            defaultCenter={{lat: this.props.currentCord.latitude, lng: this.props.currentCord.longitude}}
            defaultZoom={this.props.zoom}
            />
        </div>
            ))
        
    )
    }
    

}
const WrappedMap = withScriptjs(withGoogleMap(RefineMap.Map))
export default RefineMap;