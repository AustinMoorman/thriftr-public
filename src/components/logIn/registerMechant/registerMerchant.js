import React from 'react';
import './registerMerchant.css';
import AutoComplete from 'react-google-autocomplete';
import { get } from 'mongoose';
const request = require('request');


class RegisterMerchant extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            place: {
                latitude: '',
                longitude: '',
                formattedAddress: '',
                googleId: ''
            },
            placeVal: '',
            placeVar: false,
            name: { text: '', val: '' },
            email: { text: '', val: '' },
            password: { text: '', val: '' },
            repassword: { text: '', val: '' },
            registerVal: '',
            nextRegisterScreen: false
        }

        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.leaveTextbox = this.leaveTextbox.bind(this);
        this.setPlace = this.setPlace.bind(this);
    }

    handleChange(event) {
        this.setState({ [event.target.name]: { text: event.target.value, val: '' } })
    }

    leaveTextbox(event) {
        if (event.target.name === 'email' && !event.target.value.includes("@")) {
            this.setState({ email: { text: this.state.email.text, val: 'Please provide a valid email' } })

        }

        if (event.target.name === 'password') {
            const nums = /[0-9]/
            const ups = /[A-Z]/
            const lows = /[a-z]/
            if (event.target.value.length < 8 || !nums.test(event.target.value) || !ups.test(event.target.value) || !lows.test(event.target.value)) {
                this.setState({ password: { text: this.state.password.text, val: 'password must be between 8-20 characters long and contain a number and an uppercase and lowercase letter' } })
            }
        }

        if ((event.target.name === 'repassword' || event.target.name === 'password') && event.target.value !== this.state.password.text) {
            this.setState({ repassword: { text: this.state.repassword.text, val: 'passwords must match' } })
        }
        if ((event.target.name === 'repassword' || event.target.name === 'password') && event.target.value === this.state.password.text) {
            this.setState({ repassword: { text: this.state.repassword.text, val: '' } })
        }

        if (!event.target.value) {
            this.setState({ [event.target.name]: { val: '' } })
        }
        return;
    }

    handleRegister(event) {
        const newUser = {
            name: this.state.name.text,
            email: this.state.email.text,
            password: this.state.password.text
        }
        if (this.state.password.val || this.state.email.val || this.state.repassword.val || this.state.name.val) {
            this.setState({ registerVal: "please fix the above requirments" })
        } else if (!this.state.placeVar) {
            this.setState({ placeVal: "if finding your location below doesn't work then your business couldn't be found with google and you should contact us" })

        } else {
            const body = {
                place: this.state.place,
                name: this.state.name.text,
                email: this.state.email.text,
                password: this.state.password.text
            }
            console.log(body)
            fetch('http://localhost:3005/api/register-merchant',
                { method: 'POST', body: JSON.stringify(body), mode: 'cors', headers: { 'Content-Type': 'application/json' } })
                .then(res => {
                    if (res.status == 201) {
                        document.getElementById('autoComplete').value = ''
                        this.setState({
                            name: { text: '', val: '' },
                            email: { text: '', val: '' },
                            password: { text: '', val: '' },
                            repassword: { text: '', val: '' },
                            registerVal: 'registration successful'
                        })
                    } else if (res.status == 304) {
                        this.setState({ registerVal: 'location or email is already taken please try logging in' })
                    } else {
                        this.setState({ registerVal: 'there was an error please try again' })
                    }
                })

        }
    }
    setPlace(place) {
        if (place.place_id) {
            const name = (document.getElementById('autoComplete').value.split(','))[0]
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            fetch('http://localhost:3005/api/register-merchant/verify-id',
                { method: 'POST', body: JSON.stringify({ googleId: place.place_id }), mode: 'cors', headers: { 'Content-Type': 'application/json' } })
                .then(res => {
                    if (res.status == 200) {
                        this.setState({
                            place: {
                                latitude: lat,
                                longitude: lng,
                                formattedAddress: place.formatted_address,
                                googleId: place.place_id
                            },
                            name: { text: name, val: '' },
                            placeVar: true
                        })
                    } else {
                        this.setState({ placeVal: 'this location already has an account try logging in' })
                    }
                }
                )
        }
    }

    render() {
        return (
            <div className="registerUser">
                <div className="head">
                    <h1>thrift<span className="green">r</span></h1>
                </div>
                <div className="registerUserInputs">
                <p className="valPassword">{this.state.placeVal}</p>
                    <AutoComplete
                        id="autoComplete"
                        types="establishment"
                        placeholder="enter name followed by address"
                        onPlaceSelected={this.setPlace}
                    />

                    <p className="val">{this.state.email.val}</p>
                    <input name="email"
                        value={this.state.email.text}
                        onChange={this.handleChange}
                        onFocus={this.handleFirstClick}
                        onBlur={this.leaveTextbox}
                        placeholder="email" >
                    </input>

                    <p className="valPassword">{this.state.password.val}</p>
                    <input type="password"
                        name="password"
                        value={this.state.password.text}
                        onChange={this.handleChange}
                        onFocus={this.handleFirstClick}
                        onMouseDown={this.handleFirstClick}
                        onBlur={this.leaveTextbox}
                        placeholder="password" >
                    </input>

                    <p className="val">{this.state.repassword.val}</p>
                    <input type="password"
                        name="repassword"
                        value={this.state.repassword.text}
                        onChange={this.handleChange}
                        onFocus={this.handleFirstClick}
                        onMouseDown={this.handleFirstClick}
                        onBlur={this.leaveTextbox}
                        placeholder="confirm password">
                    </input>
                    <button onClick={this.handleRegister}>Register</button>
                    <p className="val">{this.state.registerVal}</p>
                    <button onClick={this.props.loginReturn}>return to login</button>
                </div>

            </div>

        )
    }
}

export default RegisterMerchant;