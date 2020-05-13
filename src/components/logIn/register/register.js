import React from 'react';
import './register.css';
const request = require('request');

class Register extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: { text: '', val: '' },
            email: { text: '', val: '' },
            password: { text: '', val: '' },
            repassword: { text: '', val: '' },
            registerVal: ''
        }

        this.handleRegister = this.handleRegister.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.leaveTextbox = this.leaveTextbox.bind(this);
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
        } else {
            console.log('register')
            request.post(`${process.env.REACT_APP_EXPRESS_URL}/api/register`, { body: newUser, json: true }, (err, res, body) => {
                if (res.statusCode == 201) {
                    this.setState({
                        name: { text: '', val: '' },
                        email: { text: '', val: '' },
                        password: { text: '', val: '' },
                        repassword: { text: '', val: '' },
                        registerVal: 'registration successful'
                    })
                } else if (res.statusCode == 304) {
                    this.setState({ registerVal: 'email is already taken please login' })
                }
            })
        }


    }

    render() {
        return (
            <div className="registerUser">
                <div className="head">
                    <h1>thrift<span className="green">r</span></h1>
                </div>
                <form className="registerUserInputs">
                    <input name="name"
                        value={this.state.name.text}
                        onChange={this.handleChange}
                        onFocus={this.handleFirstClick}
                        onBlur={this.leaveTextbox}
                        placeholder="name" >
                    </input>

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
                    <button onClick={this.handleRegister}>register</button>
                    <p className="val">{this.state.registerVal}</p>
                    <button onClick={this.props.loginReturn}>return to login</button>
                </form>
            </div>

        )
    }
}

export default Register;