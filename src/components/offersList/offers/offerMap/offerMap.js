import React from 'react';
import {Map, Circle, Marker, GoogleApiWrapper} from 'google-maps-react';

 
class OfferMap extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        //this.mapMarker = this.mapMarker.bind(this)
        this.getBounds = this.getBounds.bind(this);

    }
    getBounds() {
        const bounds = new this.props.google.maps.LatLngBounds();
        bounds.extend({lat: this.props.currentLocation.latitude, lng: this.props.currentLocation.longitude})
        bounds.extend({lat: this.props.offerLocation.coordinates[1], lng: this.props.offerLocation.coordinates[0]})

        return bounds
    }

    render() {
        return (
            <Map google={this.props.google}
            initialCenter={{lat: this.props.currentLocation.latitude, lng: this.props.currentLocation.longitude}} bounds={this.getBounds()} scrollwheel={false} draggable={false} zoomControl={false} mapTypeControl={false} scaleControl={false} streetViewControl={false} panControl={false} rotateControl={false} fullscreenControl={false}
            Style={{
                width: "100vw",
                maxWidth: "800px",
                height: "75vw",
                maxHeight: "600px",
              }}>
                <Marker position={{lat: this.props.currentLocation.latitude, lng: this.props.currentLocation.longitude}} />
                <Marker position={{lat: this.props.offerLocation.coordinates[1], lng: this.props.offerLocation.coordinates[0]}} />

            </Map>
    );
  }
}
 
export default GoogleApiWrapper({
  apiKey: 'AIzaSyAvSwkP5aKgqIhubRUdI_2xYixBoshD9j0'
})(OfferMap)

